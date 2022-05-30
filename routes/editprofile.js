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
//     console.log('Database Connected to editprofile-page.js')
// })

const connect = require('../db-connect')
connect()

router.get('/', async (req, res) => {
    await database.collection('users').find({}).toArray((err, results_userdata) => {
        if (err) throw err
        console.log("This is the userdata from edit profile page==>", results_userdata)
        res.render('editprofile', {
            title: 'Edit your profile',
            user_data: results_userdata
        })
    })
})

module.exports = router