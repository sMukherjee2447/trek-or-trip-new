const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
    place: {
        type: String,
        require: true
    },

    placeid: {
        type: String,
        required: true
    },

    package_name: {
        type: String,
        required: true
    },

    package_id: {
        type: String,
        required: true
    },
    stay: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    transportation: {
        type: String,
        required: true
    },
    facility: {
        type: String,
        require: true
    },
    starRating: {
        type: String
    },
    cover: {
        type: String,
    },
    images: {
        type: String,
    },
    about: {
        type: String,
        required: true
    },
    img1: {
        type: String,
    },
    img2: {
        type: String,
    },
    img3: {
        type: String,
    },
    img4: {
        type: String,
    },
    img5: {
        type: String,
    }


}, {
    collection: 'place'
})


const model = mongoose.model('uploadSchema', uploadSchema)

module.exports = model