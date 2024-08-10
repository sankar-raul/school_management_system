const db = require('../dbConnections/sqldb')
const generateOtp = require('../functions/generateOtp')
const sendMail = require('../functions/sendMail');
const forgot = async (req, res) => {
    console.log(req.body)
    if (!req.body.email || !req.body.u_type) {
        return res.end('email and u_type required')
    }
    const isValid = await isValidEmail(req.body)
    if (isValid == 'invalid user type') {
        return res.end('invalid user type')
    }
    if (!isValid) {
        return res.end('Account not found!')
    } 
    db.query(`select u_id from otp where u_id = ?`, req.body.email, async (error, result) => {
        if (error) {
            console.error(error, `select u_id from otp where u_id = ?`)
            return res.status(500).end('Internal server error')
        }
        if (result[0]) {
            db.query(`delete from otp where u_id = ?`, result[0].u_id, (err) => {
                if (err) {
                    console.error(err)
                    return res.end('Internal server error')
                }
        })
        }
        const isSent = await newOtp(req.body.email)
        return res.end(isSent ? 'Otp sent successfuly!' : "Otp not sent!")
    })
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
                return reject(error)
            }
            if (result[0]) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        })
    })
}
const newOtp = async (email) => {
    return new Promise((resolve, reject) => {
        const otp = generateOtp()
        db.query(`insert into otp (u_id, code) value (?, ?)`, [email, otp], async (error) => {
            if (error) {
                console.error(error)
                return reject(false)
            }
            console.log(otp)
            const isMailSent = await sendMail({email: email, otp: otp}, "Varify Otp")
            console.log(isMailSent)
            return resolve(isMailSent)
        })
    })
}
module.exports = forgot