const mongoose = require('mongoose')

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
    },
    filename: {
        type: String
    }


}, {
    collection: 'feedback'
})


const model = mongoose.model('reviewSchema', reviewSchema)

module.exports = model