const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true
    },

    number: {
        type: String,
        required: true
    },

    number2: {
        type: String,
        required: true
    },
    visit: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    persons: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        require: true
    }


}, {
    collection: 'booking'
})


const model = mongoose.model('bookingSchema', bookingSchema)

module.exports = model