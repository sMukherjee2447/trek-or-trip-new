const express = require('express')
const reviewDb = require('../models/review')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient

var database

const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
    useNewUrlParser: true
}, (error, result) => {
    if (error)
        throw error
    database = result.db('trek-or-trip')
    console.log('Database Connected to review.js')
})

router.get('/', (req, res) => {
    res.render('review')
})

router.post('/', async (req, res) => {
    let {
        name,
        email,
        location,
        place,
        review
    } = req.body

    console.log("details from review-->>", {
        name,
        email,
        location,
        place,
        review
    })

    const new_review = await reviewDb.create({
        name,
        email,
        location,
        place,
        review
    })
    console.log("New Review recorded -->".new_review)
    res.redirect('/all-reviews')

})

module.exports = router