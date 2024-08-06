const mysql = require("mysql2")
require("dotenv").config
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.DBPORT || 3306,
})
connection.connect(error => {
    if (error) {
        console.log(error)
    } else {
        console.log("Connection OK!")
    }
})
module.exports = connection