const express = require("express")
const app = express()
require("dotenv").config()
const cookieParser = require('cookie-parser')
const port = process.env.port || 8080
const students = require("./routes/students")
const home = require('./routes/home')
const dashboard = require('./routes/dashboard')
const faculties = require('./routes/faculties')
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use((req, res, next) => {
    console.log(req.cookies)
    const isLogedin = true
    req.isLogedin = isLogedin
    next()
})
app.use('/', home)
app.use("/students", students)
app.use('/dashboard', dashboard)
app.use('/faculties', faculties)
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
