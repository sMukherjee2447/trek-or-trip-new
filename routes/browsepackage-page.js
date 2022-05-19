const express = require('express')

const router = express.Router()
const MongoClient = require('mongodb').MongoClient

var database

const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
    useNewUrlParser: true
}, (error, result) => {
    if (error)
        throw error
    database = result.db('trek-or-trip')
    console.log('Database Connected to browsepackage-page.js')
})

router.get('/:place', async (req, res) => {
    const place = req.params.place

    console.log("This is the id from browsepackage-page.js", place)
    const placedetails = await database.collection('special_package').find({
        "place": place
    }).toArray((err, result_browsepackage) => {
        if (err) {
            throw err
        }
        console.log("This is the data from placedetails-->", result_browsepackage)
        res.render('browse_package', {
            placedetails: result_browsepackage
        })
    })
})

module.exports = router