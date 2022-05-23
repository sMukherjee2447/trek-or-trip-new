const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient

var database

const connection = MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
    useNewUrlParser: true
}, (error, result) => {
    if (error)
        throw error
    database = result.db('trek-or-trip')
    console.log('Database Connected to placebrowse.js')
})

router.get('/:id', async (req, res) => {
    const id = req.params.id

    console.log("This is the id", id)
    const place_browse_data = await database.collection('place').find({
        "placeid": id
    }).toArray((err, result_browse_package) => {
        if (err) {
            throw err
        }
        console.log("This is the data from placebrowse-->", result_browse_package)
        res.render('placebrowse', {
            place_data: result_browse_package,
            title: 'Browse'
        })
    })
})

module.exports = router