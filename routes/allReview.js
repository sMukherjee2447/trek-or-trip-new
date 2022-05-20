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
    console.log('Database Connected to all reviews.js')
})

router.get('/', (req, res) => {
    const allReview_data = database.collection('feedback').find({}).toArray((err, result_feedback) => {
        if (err) {
            throw err
        }
        console.log("The feedback data are-->", result_feedback)
        res.render('allReview', {
            feedback_data: result_feedback
        })
    })

})

module.exports = router