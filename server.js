const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.port || 8080
const students = require("./routes/students")
app.use(express.static("static"))
app.use("/students", students)
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
