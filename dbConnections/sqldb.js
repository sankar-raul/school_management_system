const mysql = require("mysql2")
require("dotenv").config
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PWD,
    database: process.env.DB
})
connection.connect(error => {
    if (error) {
        console.log(error)
    } else {
        console.log("Connection OK!")
    }
})
module.exports = connection