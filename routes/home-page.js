require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser())
app.use(express.json())
app.use(function (req, res, next) {
    req.header("Content-Type", "text/html");
    next();
});

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
// const auth = async (req, res, next) => {
//     try {
//         const token = req.cookies.JWT
//         const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
//         console.log(verifyUser);

//         const user_data = await User.findOne({
//             register_token: verifyUser.token
//         })
//         console.log(user_data)

//         req.token = token
//         req.user_data = user_data

//         next()
//     } catch (error) {
//         res.status(401).send(error)
//     }
// }

router.get('/', async (req, res) => {
    try {

        const token = req.cookies.JWT
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
        console.log(verifyUser)

        const user_data = await User.findOne({
            register_token: verifyUser.token
        })
        console.log(user_data)
        req.token = token
        req.user_data = user_data
    } catch (error) {
        res.send("<h1>YOU NEED TO LOGIN FIRST<h1>")
    }

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