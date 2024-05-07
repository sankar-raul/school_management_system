const express = require("express")
const app = express()
require("dotenv").config()
const students = require("./routes/students")
app.use(express.static("static"))
app.use("/students", students)
app.listen(8080, () => {
    console.log("Server is running at http://localhost:8080")
})