const db = require('../dbConnections/sqldb')
function studentsPage(req, res) {
    res.send("Students management")
  }
const newStudent = (req, res) => {
    res.render("addStudents")
}
const addStudent = (req, res) => {
    const {name, dept, year, reg_date} = req.query
    if(name && dept) {
        db.query("insert into students (S_name, registration_no, dept, roll_no) values (?, ?, ?, ?, ?)", [name, section, registration_no, dept, roll_no], (error, result) => {
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
  }
const showStudents = (request, response) => {
    db.query("select * from students", (err, result) => {
        if (err) response.status(501).json(err)
        else response.status(200).json(result)
      })
  }
const searchStudents = (req, res) => {
    if (!req.query.name) 
        res.status(200).json("please provide a query")
    else {
    const name = req.query.name
    db.query("select * from students where s_name like CONCAT('%',?,'%')", [name], (err, result) => {
        if (err) res.status(501).json(err)
        const data = result.length > 0 ? result : `No search results found for "${name}"`
        res.status(200).json(data)
    })
}
}
module.exports = {studentsPage, newStudent, addStudent, showStudents, searchStudents}