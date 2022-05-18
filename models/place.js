const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    place: {
        type: String,
    },

    placeid: {
        type: String,
    },

    package_name: {
        type: String,
    },

    stay: {
        type: String,
    },

    amount: {
        type: String,

    },

    transportation: {
        type: String
    },

    facility: {
        type: String
    },

    cover: {
        type: String
    },

    star_rating: {
        type: String
    },

    about: {
        type: String
    },

    img1: {
        type: String
    },

    img2: {
        type: String
    },

    img3: {
        type: String
    },

    img4: {
        type: String
    },

    img5: {
        type: String
    },

    package_id: {
        type: String
    }
}, {
    collection: 'place'
})

const model = mongoose.model('placeSchema', placeSchema)

module.exports = model