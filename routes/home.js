const express = require("express")
const db = require("../dbConnections/sqldb")
const path = require("path")
const Route = express.Router()
Route.use((req, res, next) => {
    next();
})
Route.get('/', (req, res) => {
    res.render("home")
})
module.exports = Route
