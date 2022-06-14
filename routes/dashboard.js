const express = require('express')
const multer = require('multer')
const upload = require('../models/upload')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const uploads = multer({
    storage: storage
})

const db = require('../db-connect')
db()

router.get('/', async (req, res) => {
    const details = await database.collection('place').find({}).toArray((err, result) => {
        if (err) {
            throw err
        }
        console.log("This is the data from dashboard-->", result)
        res.render("dashboard", {
            details: result
        })
    })

})

router.post('/', uploads.single('cover'), async (req, res) => {
    const image = req.file
    console.log('this is image from dashboard==>', image)
    console.log('this is filename from dashboard==>', image.filename)

    var cover = image.filename
    let {
        place,
        placeid,
        package_name,
        package_id,
        stay,
        amount,
        transportation,
        facility,
        starRating,
        about
    } = req.body

    console.log("This data is from dashboard:==>", {
        place,
        placeid,
        package_name,
        package_id,
        stay,
        amount,
        transportation,
        facility,
        starRating,
        about
    })

    let errors = []

    const data = await upload.findOne({
        package_name
    })

    if (!data) {
        const new_data = await upload.create({
            place,
            placeid,
            package_name,
            package_id,
            stay,
            amount,
            transportation,
            facility,
            starRating,
            cover,
            about
        })

        res.redirect('/dashboard')
    } else {
        errors.push({
            msg: 'Package name already exists'
        })
    }

})

module.exports = router