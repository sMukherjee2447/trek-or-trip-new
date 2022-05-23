const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render("faq", {
        title: 'FAQ'
    })
})

module.exports = router