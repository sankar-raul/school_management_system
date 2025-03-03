const express = require("express")
const app = express()
const path = require('path')
require("dotenv").config()
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 8080
const students = require("./routes/students")
const home = require('./routes/home')
const dashboard = require('./routes/dashboard')
const faculties = require('./routes/faculties')
const cookieCheck = require('./functions/cookieCheck')
app.use(cookieParser())
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"))
app.use(cookieCheck)
app.use('/', home)
app.use("/students", students)
app.use('/dashboard', dashboard)
app.use('/faculties', faculties)
app.use((req, res) => {
    res.render('404')
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
