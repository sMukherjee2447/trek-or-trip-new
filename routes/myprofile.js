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
//     console.log('Database Connected to my profile')
// })
const connect = require('../db-connect')
connect()

// const token = req.cookies.JWT

router.get('/:fname', async (req, res) => {
    var fname = req.params.fname
    const user_details = await database.collection('users').find({
        fname
    }).toArray((err, result_user) => {
        if (err) throw err
        console.log("This is user details for my profile-->", result_user)
        res.render('myprofile', {
            user_data: result_user
        })
    })
})

module.exports = router