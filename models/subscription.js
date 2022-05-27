const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
    }
}, {
    collection: 'subscription'
})


const model = mongoose.model('subscriptionSchema', subscriptionSchema)

module.exports = model