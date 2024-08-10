const db = require('../dbConnections/sqldb')
const varifyLogin = require('./loginVarify')
const deleteCookie = require('../functions/deleteCookie')
const forgotApi = require('./forgotPost')
const varifyOtpPost = require('./varifyOtpPost')
function studentsPage(req, res) {
    if (req.isLogedin && req.u_type == 'student') {
        db.query(`select * from students where email = ?`, req.cookies.u_id,(error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).end('Intenal server error')
            }
            return res.render("student_profile", {std_info: result[0]})
        })
    } else {
        return res.redirect('/students/login')
    }
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
const login = async (req, res) => {
    if (req.isLogedin) {
        return res.redirect(`/${req.u_type == 'admin' ? 'dashboard' : req.u_type + 's'}`)
    }
    res.render('login', {u_type: 'Student'})
}
const loginPost = async (req, res) => {
    // console.log("/")
    if (req.isLogedin) {
        return res.redirect('/students')
    }
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(502).send('email and password is required!')
    }
    varifyLogin({u_type: 'student', data: {email, password}, req, res})
    // res.send("ok")
    
}
const forgot = (req, res) => {
    if (req.isLogedin) {
        return res.redirect('/students')
    }
    res.render("forgot", {u_type: "Student"})
}
const logout = async (req, res) => {
    if (req.isLogedin) await deleteCookie(req.cookies, res)
    res.redirect('/students/login')
}
const forgotPost = async (req, res) => {
    if (req.isLogedin && req.u_type == 'student') {
        return res.end('you are already logged in!')
    }
    await forgotApi(req, res)
}
const varifyOtp = async (req, res) => {
    await varifyOtpPost(req, res)
}
module.exports = {studentsPage, newStudent, addStudent, showStudents, searchStudents, login, loginPost, logout, forgot, forgotPost, varifyOtp}