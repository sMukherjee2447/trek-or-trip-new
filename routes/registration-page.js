var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user')
const mongoose = require('mongoose')
const multer = require('multer')

const path = require('path')

mongoose.connect("mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/trek-or-trip", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected on registration-page'))
    .catch(e => console.log(e));


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
        email,
        gender,
        location,
        address,
        pass,
        pass2,
    } = req.body;
    console.log({
        fname,
        lname,
        email,
        gender,
        location,
        address,
        pass,
        pass2,

    });

    let errors = [];


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
            var hashed_pass1 = bcrypt.hashSync(pass, 10)
            console.log(hashed_pass1)

            var hashed_pass2 = bcrypt.hashSync(pass2, 10)
            console.log(hashed_pass2)

            const new_user = await User.create({
                fname,
                lname,
                email,
                gender,
                location,
                address,
                hashed_pass1,
                hashed_pass2,
                register_token,
                filename
            })
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