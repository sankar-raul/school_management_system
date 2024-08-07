const db = require('../dbConnections/sqldb')

const varifyOtpPost = async (req, res) => {
    const { otp, email } = req.body
    if (!otp || !email) {
        return res.end('email and otp required')
    }
    const varified = await varify(email, otp)
    if (varified == 'expired') {
        return res.end("Otp expired! Please request for a new otp")
    }
    if (varified) {
        return res.end('Otp varified')
    } else {
        return res.end('Invalid Otp!')
    }
}
const varify = async (email, otp) => {
    return new Promise((resolve, reject) => {
        db.query(`select u_id from otp where u_id = ? and code = ?`, [email, otp], (error, result) => {
            if (error) {
                console.log(error)
                return reject(error)
            }
            if (result[0]) {
                db.query(`delete from otp where u_id = ? and code = ?`, [email, otp], (err) => {
                    if (err) {
                        console.error(err)
                    }
                })
                return resolve(true)
            } else {
                return resolve(false)
            }
        })
    })
}
module.exports = varifyOtpPost