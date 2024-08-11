const db = require('../dbConnections/sqldb')
const changePassword = require('../functions/changePassword')
const createCookie = require('../functions/createCookie')

const varifyOtpPost = async (req, res) => {
    const { otp, email, newPassword, u_type } = req.body
    if (!otp || !email) {
        return res.end('email and otp required')
    }
    const varified = await varify(email, otp)
    if (varified == 'expired') {
        return res.end("Otp expired! Please request for a new otp")
    }
    if (varified) {
        if (newPassword) {
            const isPasswordChanged = await changePassword(email, u_type, newPassword)
            if (isPasswordChanged) {
                const status = await createCookie({u_id: email, u_type: u_type, ex: 10})
                if (status == 'error') return res.status(500).send('cookie inserting error!')
                    console.log(status)
                res.cookie('u_id', status.u_id, { expires: new Date(Date.now() + status.ex), httpOnly: true })
                res.cookie('security_key', status.newSecurityKey, { expires: new Date(Date.now() + status.ex), httpOnly: true })
                return res.end('refresh')
            } else {
                return res.end('Error: Password not changed!')
            }
        }
    } else {
        return res.end('Invalid Otp!')
    }
}
const varify = async (email, otp) => {
    console.log(otp)
    return new Promise((resolve, reject) => {
        db.query(`select code from otp where u_id = ?`, [email], (error, result) => {
            if (error) {
                console.log(error)
                return reject(error)
            }
            if (result[0]) {
                if (result[0].code == otp) {
                    db.query(`delete from otp where u_id = ? and code = ?`, [email, otp], (err) => {
                        if (err) {
                            console.error(err)
                        }
                        return resolve(true)
                    })
                } else {
                    return resolve(false)
                }
                
            } else {
                return resolve('expired')
            }
        })
    })
}
module.exports = varifyOtpPost