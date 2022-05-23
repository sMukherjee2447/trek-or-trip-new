const express = require('express')
const router = express.Router()
const contactDb = require("../models/contact-us")
const MongoClient = require('mongodb').MongoClient

var database

const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
    useNewUrlParser: true
}, (error, result) => {
    if (error)
        throw error
    database = result.db('trek-or-trip')
    console.log('Database Connected to contact.js')
})

router.get('/', (req, res) => {
    res.render('contact', {
        title: 'Contact Us'
    })
})

router.post('/', async (req, res) => {
    let {
        name,
        email,
        subject,
        message
    } = req.body

    console.log("This is the user details for contact-->", {
        name,
        email,
        subject,
        message
    })

    const contact_us = await contactDb.create({
        name,
        email,
        subject,
        message
    })

    console.log("New Message-->", contact_us)
    res.redirect('/home')
})

module.exports = router