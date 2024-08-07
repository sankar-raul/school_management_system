const express = require('express')
const db = require('../dbConnections/sqldb')
const dashLoginPost = require('../controllers/dashboard/dashLoginPost')
const dashLoginGet = require('../controllers/dashboard/dashLoginGet')
const dashLogoutGet = require('../controllers/dashboard/dashLogoutGet')
const forgotGet = require('../controllers/forgotGet')
const forgotPost = require('../controllers/forgotPost')
const varifyOtpPost = require('../controllers/varifyOtpPost')
const dash = express.Router()
dash.post('/login', dashLoginPost)
dash.get('/login', dashLoginGet)
dash.get("/forgot", forgotGet)
dash.post('/forgot', forgotPost)
dash.post('/forgot/varify', varifyOtpPost)
dash.use((req, res, next) => {
    if (req.isLogedin) {
        next()
    } else {
        return res.redirect('/dashboard/login')
    }
})
dash.get('/', (req, res) => {
    res.render('dashboard')
})
dash.get('/logout', dashLogoutGet)
module.exports = dash