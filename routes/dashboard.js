const express = require('express')
const dash = express.Router()
dash.use((req, res, next) => {
    if (req.isLogedin) {
        next()
    } else {
        res.render('adminLogin')
    }
})
dash.get('/', (req, res) => {
    
    res.render('dashboard')
})
module.exports = dash