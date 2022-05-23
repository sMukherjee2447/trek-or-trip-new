const express = require('express')
const bookingdb = require('../models/booking')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient

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
    let {
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

    let new_booking = await bookingdb.create({
        name,
        email,
        number,
        number2,
        visit,
        gender,
        persons,
        amount
    })
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