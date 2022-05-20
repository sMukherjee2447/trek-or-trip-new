const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
// const res = require('express/lib/response')

const reviewSchema = new mongoose.Schema({
    Customer: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    place: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }


}, {
    collection: 'feedback'
})


const model = mongoose.model('reviewSchema', reviewSchema)

module.exports = model