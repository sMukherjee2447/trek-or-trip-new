require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const subscribe = require('../models/subscription')
const nodemailer = require('nodemailer')
const {
    google
} = require('googleapis')

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

router.get('/', async (req, res) => {
    try {
        var token = req.cookies.JWT
        var verifyUser = jwt.verify(token, process.env.JWT_SECRET)
        console.log("This is verify user==>", verifyUser)

        const user_data = await User.findOne({
            register_token: verifyUser.token
        })
        console.log("Found data with token:", user_data)
        req.token = token
        req.user_data = user_data
    } catch (error) {
        res.redirect('/loginfirst')
    }

    place_data = await database.collection('Place_Table').find({}).toArray(async (err, result_placeData) => {
        if (err) throw err

        all_place_data = await database.collection('place').find({}).toArray(async (error, result_allPlaceData) => {
            if (error) throw err

            feedback_data = await database.collection('feedback').find({}).toArray(async (err, result_feedbackData) => {
                if (err) throw err

                special_package_data = await database.collection('special_package').find({}).toArray(async (err, result_specialPackage) => {
                    if (err) throw err

                    user_data = await database.collection('users').find({
                        "register_token": req.cookies.JWT
                    }).toArray((err, result_user_data) => {
                        if (err) throw err
                        console.log("Data from register token==>>", result_user_data)

                        res.render('home-page.ejs', {
                            title: 'Trek or Trip',
                            pageSlug: 'trek or trip',
                            place_data: result_placeData,
                            all_place_data: result_allPlaceData,
                            feedback_data: result_feedbackData,
                            special_package_data: result_specialPackage,
                            user_data: result_user_data
                        })
                    })
                })
            })
        })
    })
    if (req.query.search_text) {
        const regex = new RegExp(escapeRegex(req.query.search_text), 'gi');
        search_data = await database.collection('place').find({
            $or: [{
                "place": regex
            }, {
                "package_name": regex
            }]
        }).toArray((err, results_search_data) => {
            if (err) {
                console.log(err)
            } else {
                res.render('search', {
                    search_data: results_search_data
                })
            }
        })

    }

})

router.post('/', async (req, res) => {
    let mail = req.body.mail

    console.log("This is the subscribe mail-->>", mail)
    const new_subscribe = await subscribe.create({
        mail
    })

    res.redirect('/home')

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
                to: mail,
                subject: "Hello from TrekOrTrip",
                text: 'hellow from gmail api',
                extentions: 'ejs',
                root: 'email'
            };

            const result = await transport.sendMail(mailOptions)

        } catch (error) {
            return error
        }
    }

    sendMail().then(result => console.log("Email sent....", result))
        .catch((error) => console.log(error.message))

})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router