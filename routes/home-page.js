const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var router = express.Router()
var database

const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
    useNewUrlParser: true
}, (error, result) => {
    if (error)
        throw error
    database = result.db('trek-or-trip')
    console.log('Database Connected to home-page')
})



router.get('/', async (req, res) => {

    place_data = await database.collection('Place_Table').find({}).toArray(async (err, result_placeData) => {
        if (err) throw err
        console.log('this is the data from home-page.js', result_placeData)

        all_place_data = await database.collection('place').find({}).toArray(async (error, result_allPlaceData) => {
            if (error) throw err
            console.log('this is all_place_data from home-page.ejs', result_allPlaceData)

            feedback_data = await database.collection('feedback').find({}).toArray(async (err, result_feedbackData) => {
                if (err) throw err
                console.log('this is feedback data from home-page.js-->>', result_feedbackData)

                special_package_data = await database.collection('special_package').find({}).toArray((err, result_specialPackage) => {
                    if (err) throw err
                    console.log('this is special package data from home-page.js-->>', result_specialPackage)

                    res.render('home-page.ejs', {
                        title: 'Trek or Trip',
                        pageSlug: 'trek or trip',
                        place_data: result_placeData,
                        all_place_data: result_allPlaceData,
                        feedback_data: result_feedbackData,
                        special_package_data: result_specialPackage
                    })
                })
            })
        })
    })
})

module.exports = router