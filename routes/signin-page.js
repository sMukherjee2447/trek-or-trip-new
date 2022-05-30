const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// mongoose.connect("mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/trek-or-trip", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log('connected on login-page'))
//     .catch(e => console.log(e));

const connect = require('../db-connect')
connect()

router.get('/', (req, res) => {
    res.render("signin", {
        title: 'Signin with Trek or Trip',
        pageSlug: 'sign-in'
    })
})

router.post('/', async (req, res) => {
    let {
        uname,
        password
    } = req.body

    console.log('login credentials-->', {
        uname,
        password
    })
    let errors = []

    const user = await User.findOne({
        username: uname
    })

    console.log("This is the user-->", user)
    if (user) {
        const isMatch = bcrypt.compareSync(password, user.hashed_pass1)

        const login_token = user.register_token
        console.log("signin token-->", login_token)

        res.cookie("JWT", login_token, {
            expires: new Date(Date.now() + 300000000),
            httpOnly: true
        })
        if (isMatch) {
            res.redirect('/home')
        } else {
            errors.push({
                message: "Authentication failed / Invalid Password"
            })
            res.render('signin.ejs', {
                errors
            })
        }
    } else {
        errors.push({
            message: "User not found, Please register first"
        })
        res.render('signin.ejs', {
            errors
        })
    }
})

module.exports = router