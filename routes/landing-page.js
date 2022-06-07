const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('landing-page.ejs', {
        title: 'Welcome to Trek-or-Trip',
        pageSlug: 'trek-or-trip'
    })
})

module.exports = router