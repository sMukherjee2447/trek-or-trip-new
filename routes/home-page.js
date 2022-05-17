const express = require('express')

var router = express.Router()

router.get('/', (req, res, next) => {
    res.render('home-page.ejs', {
        title: 'Trek or Trip',
        pageSlug: 'trek or trip'
    })
})

module.exports = router