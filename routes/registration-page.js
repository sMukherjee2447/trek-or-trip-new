var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user')
// const mongoose = require('mongoose')
const multer = require('multer')
const nodemailer = require('nodemailer')
const {
    google
} = require('googleapis')


// mongoose.connect("mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/trek-or-trip", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log('connected on registration-page'))
//     .catch(e => console.log(e));

const connect = require('../db-connect')
connect()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const upload = multer({
    storage: storage
})



/* GET registration page. */
router.get('/', function (req, res, next) {
    res.render('registration', {
        title: 'Register'
    });
});


router.post('/', upload.single('image'), async (req, res) => {
    const image = req.file
    console.log("This is the image==>", image)
    console.log('this is the file name-->>', image.filename)
    filename = image.filename

    let {
        fname,
        lname,
        age,
        dob,
        username,
        email,
        gender,
        location,
        address,
        zip,
        country,
        code,
        phone,
        pass,
        pass2,
    } = req.body;
    console.log({
        fname,
        lname,
        age,
        dob,
        username,
        email,
        gender,
        location,
        address,
        zip,
        country,
        code,
        phone,
        pass,
        pass2,

    });

    let errors = [];


    if (!fname || !lname || !email || !pass || !pass2 || !age) {
        errors.push({
            message: "Please enter all the fields"
        });
    }

    if (pass.length < 6) {
        errors.push({
            message: "Password should be at least 6 charecters long"
        });
    }

    if (pass != pass2) {
        errors.push({
            message: "Passwords do not match"
        });
    }

    if (errors.length > 0) {
        res.render('registration', {
            errors
        });
    } else {
        const register_token = await User.generateAuthToken()
        console.log("this is registration token-->>", register_token)

        res.cookie("JWT", register_token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true
        })

        const user = await User.findOne({
            username
        })

        if (!user) {
            var hashed_pass1 = bcrypt.hashSync(pass, 10)
            console.log(hashed_pass1)

            var hashed_pass2 = bcrypt.hashSync(pass2, 10)
            console.log(hashed_pass2)

            const new_user = await User.create({
                fname,
                lname,
                age,
                dob,
                country,
                code,
                phone,
                username,
                zip,
                email,
                gender,
                location,
                address,
                hashed_pass1,
                hashed_pass2,
                register_token,
                filename
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
                        html: '<h1>Thank You for registering with us</h1><br><h4>please signin to continue</h4>'
                    };

                    const result = await transport.sendMail(mailOptions)

                } catch (error) {
                    return error
                }
            }

            sendMail().then(result => console.log("Email sent....", result))
                .catch((error) => console.log(error.message))

            console.log("new user created-->>", new_user)
            res.redirect('/sign-in')
        } else {
            errors.push({
                message: "Email is already registered, please login"
            })
            res.render('registration', {
                errors
            })
        }
    }


});


module.exports = router;