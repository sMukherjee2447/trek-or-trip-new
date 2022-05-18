const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

mongoose.connect("mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/trek-or-trip", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected on login-page'))
    .catch(e => console.log(e));

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

    const find_user = await User.findOne({
        email: uname
    })
    if (find_user) {
        const isMatch = bcrypt.compare(password, find_user.hashed_pass1)

        const login_token = await User.generateAuthToken()
        console.log("signin token-->", login_token)

        res.cookie("JWT", login_token, {
            expires: new Date(Date.now() + 30000),
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
            message: "User not found"
        })
        res.render('signin.ejs', {
            errors
        })
    }
})

module.exports = router