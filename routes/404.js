const express = require('express')

const router = express()

router.get('/', (req, res) => {
    res.render('404')
})

module.exports = router