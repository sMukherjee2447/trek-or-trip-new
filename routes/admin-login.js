const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const connect = require('../db-connect')
connect()

router.get('/', (req, res) => {
    res.render("admin-login")
})

router.post('/', async (req, res) => {
    let {
        username,
        pass
    } = req.body

    console.log('login credentials-->', {
        username,
        pass
    })
    let errors = []

    const admin = await User.findOne({
        username: username
    })

    console.log("This is the admin-->", admin)
    if (admin) {
        const isMatch = bcrypt.compareSync(pass, admin.hashed_pass1)

        const login_token = admin.register_token
        console.log("signin token-->", login_token)

        res.cookie("JWT", login_token, {
            expires: new Date(Date.now() + 300000000),
            httpOnly: true
        })
        if (isMatch) {
            res.redirect('/dashboard')
        } else {
            errors.push({
                message: "Authentication failed / Invalid Password"
            })
            res.render('admin-login.ejs', {
                errors
            })
        }
    } else {
        errors.push({
            message: "User not found, Please register first"
        })
        res.render('admin-login.ejs', {
            errors
        })
    }
})

module.exports = router