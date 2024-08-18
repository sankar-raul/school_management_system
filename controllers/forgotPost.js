const db = require('../dbConnections/sqldb')
const newOtp = require('../functions/newOtp')
const forgot = async (req, res) => {
    console.log(req.body)
    if (!req.body.email || !req.body.u_type) {
        return res.end('email and u_type required')
    }
    try {
    var isValid = await isValidEmail(req.body)
    } catch (e) {
        var isValid = 'database error!'
    }
    if (isValid == 'database error!') {
        return res.end(isValid)
    }
    if (isValid == 'invalid user type') {
        return res.end('invalid user type')
    }
    if (!isValid) {
        return res.end('Account not found!')
    } 
        try {
        const isSent = await newOtp(req.body.email)
        return res.end(isSent ? 'Otp sent successfuly!' : "Otp not sent!")
        } catch (e) {
            res.send(e.message)
        }
    // })
}
const isValidEmail = async ({email, u_type}) => {
    const validTypes = {admin: 'admin', student: 'students', faculty: 'faculties'}
    if (!validTypes[u_type]) {
        return 'invalid user type'
    }
    return new Promise((resolve, reject) => {
        db.query(`select email from ${validTypes[u_type]} where email = ?`, email, (error, result) => {
            if (error) {
                console.error(error)
                return reject("email validation error!")
            }
            if (result[0]) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        })
    })
}
module.exports = forgot