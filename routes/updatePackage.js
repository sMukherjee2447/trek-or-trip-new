const express = require('express');
const router = express.Router();
const controller = require('../controller/deletecontroller');

const connect = require('../db-connect')
connect()

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const data = database.collection('place').find({
        "package_id": id
    }).toArray((err, result) => {
        if (err) {
            throw err
        }
        console.log('this is update-->', result)
        res.render('updatePackage', {
            datas: result
        })
    })
})

router.post('/:id', (req, res) => {
    const id = req.params.id
    console.log("this is from updatepackage-->", id)

    let {
        place,
        placeid,
        package,
        package_id,
        amount,
        stay,
        facility,
        transportation,
        about
    } = req.body
    console.log("again from updatePackage-->", {
        place,
        placeid,
        package,
        package_id,
        amount,
        stay,
        facility,
        transportation,
        about
    })

    database.collection('place').findOneAndUpdate({
        "package_id": id
    }, {
        "$set": {
            "place": place,
            "placeid": placeid,
            "package": package,
            "package_id": package_id,
            "amount": amount,
            "stay": stay,
            "facility": facility,
            "transportation": transportation,
            "about": about
        }
    })
    res.redirect('/dashboard')
})


module.exports = router