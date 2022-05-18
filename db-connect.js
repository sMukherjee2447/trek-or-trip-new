const express = require('express')
const MongoClient = require('mongodb').MongoClient

const connect = (req, res, next) => {

    MongoClient.connect('mongodb+srv://subham:subham@cluster0.ojwma.mongodb.net/test', {
        useNewUrlParser: true,
    }, (error, result) => {
        if (error)
            throw error
        database = result.db('trek-or-trip')
        console.log('Database Connected to db-connecte')
    })
    next()
}

module.exports = connect