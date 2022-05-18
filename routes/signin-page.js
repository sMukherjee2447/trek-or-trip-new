const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('signin.ejs', {
        title: 'Sign in to Trek-or-Trip',
        pageSlug: 'sign-in'
    })
})

module.exports = router