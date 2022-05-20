const mongoose = require('mongoose')
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },
}, {
    collection: 'contact-us'
})


const model = mongoose.model('contactSchema', contactSchema)

module.exports = model