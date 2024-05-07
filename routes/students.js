const express = require("express")
const db = require("./../dbConnections/sqldb")
const path = require("path")
const Router = express.Router()
Router.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "../static/addStudents.html"))
  })
  Router.get("/add", (req, res) => {
    const {name, section, registration_no, dept, roll_no} = req.query
    if(name && section && registration_no && dept && roll_no) {
        db.query("insert into students (name, section, registration_no, dept, roll_no) values (?, ?, ?, ?, ?)", [name, section, registration_no, dept, roll_no], (error, result) => {
            if (!error) {
                res.redirect("/students")
            } else {
                res.status(501).json(error)
            }
        })
    } else {
    console.log("please provide all data")
    res.status(501).json("please provide all data")
}
  })
  Router.get("/showStudents", (request, response) => {
    db.query("select * from students", (err, result) => {
        if (err) response.status(501).json(err)
        else response.status(200).json(result)
      })
  })
  Router.get("/search", (req, res) => {
    if (!req.query.name) 
        res.status(200).json("please provide a query")
    else {
    const name = req.query.name
    db.query("select * from students where name like CONCAT('%',?,'%')", [name], (err, result) => {
        if (err) res.status(501).json(err)
        const data = result.length > 0 ? result : `No search results found for "${name}"`
        res.status(200).json(data)
    })
}
})
  module.exports = Router