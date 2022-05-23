const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('editprofile', {
        title: 'Edit your profile'
    })
})

module.exports = router