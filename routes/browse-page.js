const express = require('express')

const router = express.Router()
// const MongoClient = require('mongodb').MongoClient

// var database

// const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
//     useNewUrlParser: true
// }, (error, result) => {
//     if (error)
//         throw error
//     database = result.db('trek-or-trip')
//     console.log('Database Connected to browse-page.js')
// })

const connect = require('../db-connect')
connect()
router.get('/', (req, res) => {

    const browse_data = database.collection('place').find({}).toArray((err, results_browse_Data) => {
        if (err) {
            throw err
        }
        res.render('browse', {
            title: 'Browse all packages',
            browse_data: results_browse_Data
        })
    })
})

module.exports = router