var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const User = require('../models/user')
const mongoose = require('mongoose')


mongoose.connect("mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/trek-or-trip", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected on registration-page'))
    .catch(e => console.log(e));

/* GET registration page. */
router.get('/', function (req, res, next) {
    res.render('registration', {
        title: 'Register'
    });
});


router.post('/', async (req, res) => {
    let {
        fname,
        lname,
        email,
        pass,
        pass2
    } = req.body;
    console.log({
        fname,
        lname,
        email,
        pass,
        pass2
    });

    let errors = [];
    const hashed_pass1 = await bcrypt.hash(pass, 10)
    console.log(hashed_pass1)

    const hashed_pass2 = await bcrypt.hash(pass2, 10)
    console.log(hashed_pass2)

    if (!fname || !lname || !email || !pass || !pass2) {
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
            email
        })

        if (!user) {
            const new_user = User.create({
                fname,
                lname,
                email,
                hashed_pass1,
                hashed_pass2,
                register_token
            })
            console.log("new user created-->>", new_user)
            let success = []
            success.push({
                message: "You are now registered, please login"
            })
            res.redirect('/sign-in')
        } else {
            errors.push({
                message: "Email is already registered"
            })
            res.render('registration', {
                errors
            })
        }
    }


});

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/home');
//     }
//     next();
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }

//     res.redirect('/sign-in');
// }



module.exports = router;