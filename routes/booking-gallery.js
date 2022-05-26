const express = require('express')
const bookingdb = require('../models/booking')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const nodemailer = require('nodemailer')
const {
    google
} = require('googleapis')

var database

const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
    useNewUrlParser: true
}, (error, result) => {
    if (error)
        throw error
    database = result.db('trek-or-trip')
    console.log('Database Connected to booking-gallery')
})

router.get('/:package_id', async (req, res) => {
    const package = req.params.package_id

    console.log("this is the id from booking special-->", package)
    const placedetails = await database.collection('place').find({
        "package_name": package
    }).toArray((err, result_placedetails) => {
        if (err) {
            throw err
        }
        console.log('this is the data from booking special-->', result_placedetails)
        res.render('booking-gallery', {
            placedetails: result_placedetails
        })
    })

})

router.post('/', async (req, res) => {
    var {
        name,
        email,
        number,
        number2,
        visit,
        gender,
        persons,
        amount
    } = req.body

    console.log("this is the booking details-->", {
        name,
        email,
        number,
        number2,
        visit,
        gender,
        persons,
        amount,
    })
    let success = []

    var new_booking = await bookingdb.create({
        name,
        email,
        number,
        number2,
        visit,
        gender,
        persons,
        amount
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
                html: '<h1>Your booking has been confirmed</h1><br><h4>hope to see you soon</h4>'
            };

            var result = await transport.sendMail(mailOptions)

        } catch (error) {
            return error
        }
    }

    sendMail().then(result => console.log("Email sent for booking....", result))
        .catch((error) => console.log(error.message))

    console.log('new booking-->', new_booking)

    success.push({
        message: "Booking registered successfully"
    })
    res.render('confirmation', {
        success,
        title: 'Booking'
    })
})

module.exports = router