const express = require('express')

const router = express.Router()
// const MongoClient = require('mongodb').MongoClient

// var database

// const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
//     useNewUrlParser: true
// }, (error, result) => {
//     if (error)
//         throw error
//     database = result.db('trek-or-trip')
//     console.log('Database Connected to gallery-browsepackage-page.js')
// })


const connect = require('../db-connect')
connect()
router.get('/:package_id', async (req, res) => {
    const package = req.params.package_id

    console.log("This is the id from browsepackage-page.js", package)
    const placedetails = await database.collection('place').find({
        "package_id": package
    }).toArray((err, result_gallery_browsepackage) => {
        if (err) {
            throw err
        }
        console.log("This is the data from placedetails-->", result_gallery_browsepackage)

        res.render('gallery-package_browse', {
            gallerydetails: result_gallery_browsepackage,
            title: 'Browse'
        })
    })
})

module.exports = router