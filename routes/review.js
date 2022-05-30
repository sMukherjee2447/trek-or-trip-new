const express = require('express')
const reviewDb = require('../models/review')
const router = express.Router()
// const MongoClient = require('mongodb').MongoClient
const nodemailer = require('nodemailer')
const {
    google
} = require('googleapis')

// var database

// const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
//     useNewUrlParser: true
// }, (error, result) => {
//     if (error)
//         throw error
//     database = result.db('trek-or-trip')
//     console.log('Database Connected to review.js')
// })

const connect = require('../db-connect')
connect()

router.get('/', (req, res) => {
    res.render('review', {
        title: 'Reviews'
    })
})

router.post('/', async (req, res) => {
    let token = req.cookies.JWT
    console.log("JWT-->", token)
    const filename = await database.collection('users').find({
        "register_token": token
    }, {
        "filename": 1,
        "_id": 1
    })
    console.log("filename-->", filename)




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

    //nodemailer
    const CLIENT_ID = '985045530780-qkjc1i50ul5tikfj7r6t2lqktt16gvo0.apps.googleusercontent.com'
    const CLIENT_SECRET = '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'
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
    const REFRESH_TOKEN = '1//04yeKRTq8CmJeCgYIARAAGAQSNwF-L9IrbJuou-zl9aYq4J1vJ6gDMyRpfS-CZx8U1HMu9dhjt9_50L9kVXtXPJH6JuwcVqKEnHw'

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
    })

    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken()

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'subha.mukh.10.2@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })

            const mailOptions = {
                from: 'TrekOrTrip <subha.mukh.10.2@gmail.com>',
                to: email,
                subject: "Hello from TrekOrTrip",
                text: 'hellow from gmail api',
                html: '<h1>We have received your feedback</h1><br><h4>Thank You for sharing your valuable feedback</h4>'
            };

            var result = await transport.sendMail(mailOptions)

        } catch (error) {
            return error
        }
    }

    sendMail().then(result => console.log("Email sent for booking....", result))
        .catch((error) => console.log(error.message))

    const new_review = await reviewDb.create({
        name,
        email,
        location,
        place,
        review,

    })
    console.log("New Review recorded -->".new_review)
    res.redirect('/all-reviews')

})

module.exports = router