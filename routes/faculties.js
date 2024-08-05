const express = require('express')
const faculties = express.Router()
const { getAllFaculties } = require('../controllers/faculties')
faculties.use((req, res, next) => {
    next()
})
faculties.get('/', (req, res) => {
    res.render('faculties')
})
faculties.get('/all', getAllFaculties)
module.exports = faculties