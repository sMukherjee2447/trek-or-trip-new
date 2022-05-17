const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('landing-page.ejs', {
        title: 'Welcome to Trek-or-Trip',
        pageSlug: 'trek-or-trip'
    })
})

module.exports = router