const db = require('../dbConnections/sqldb')
const varifyLogin = require('./loginVarify')
const deleteCookie = require('../functions/deleteCookie')
const forgotApi = require('./forgotPost')
const varifyOtpAndChangePass = require('./varifyOtpPost')
const getAllDept = require('../functions/getAllDept')
const newOtp = require("../functions/newOtp")
const varifyOtp = require('../functions/varifyOtp')
function studentsPage(req, res) {
    if (req.isLogedin && req.u_type == 'student') {
        db.query(`select * from students_dept_view where email = ?`, req.cookies.u_id,(error, result) => {
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
const register = async (req, res) => {
    let dept_info = {}
    try {
    dept_info = await getAllDept()
    }
    catch (e) {
        console.log(e)
    }
    res.render("register", {dept_info})
}
const registerPost = async (req, res) => {
    const {name, dept, year, dob, phone, email, otp} = req.body
    const reg_date = req.headers['client-timestamp']
//     if(name && dept && year && reg_date, dob, phone, email) {
//         db.query("insert into students (s_name, dept_id) values (?, ?, ?, ?, ?)", [name, section, registration_no, dept, roll_no], (error, result) => {
//             if (!error) {
//                 res.end("/students")
//             } else {
//                 console.log(error)
//                 res.status(500).end('data inserting errorerror')
//             }
//         })
//     } else {
//     console.log("please provide all data")
//     res.status(501).json("please provide all data")
// }
const isVarified = await varifyOtp(email, otp)
if (isVarified == 'expired') {
    return res.end('expired')
} else if (isVarified) {
    return res.end('varified')
} else {
    return res.end('not varified')
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
const check = (req, res) => {
    const validTypes = ['email', 'phone']
    const type = validTypes.find((type) => type == Object.keys(req.query)[0])
    if (type) {
        db.query(`select ${type} from students where ${type} = ?`, req.query[type], (error, result) => {
            if (error) {
                console.log(error)
                return res.end(error.message)
            }
            if(result[0]) {
                return res.end('exists')
            }
            return res.end("not exists")
        })
    } else {
        res.end('invalid query')
    }
}
const otp = async (req, res) => {
    const {email} = req.body
    if (!email) {
        return res.end("email required")
    }
    try {
    const isSent = await newOtp(email)
    if (isSent) {
        return res.end("success")
    } else {
        return res.end("failed")
    }
    } catch (e) {
        res.status(500).end(e.message)
    }
}
module.exports = {otp, check, studentsPage, register, registerPost, showStudents, searchStudents, login, loginPost, logout, forgot, forgotPost, varifyOtpAndChangePass}