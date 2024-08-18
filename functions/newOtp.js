const db = require('../dbConnections/sqldb')
const generateOtp = require("./generateOtp")
const sendMail = require('./sendMail')
const newOtp = async (email) => {
    return new Promise(async (resolve, reject) => {
        const otpCheck = new Promise((reso, reje) => {
            db.query(`select u_id from otp where u_id = ?`, email, async (error, result) => {
            if (error) {
                console.log(error, `select u_id from otp where u_id = ?`)
                return reje('Internal server error')
            }
            if (result[0]) {
            db.query(`delete from otp where u_id = ?`, result[0].u_id, (err) => {
                    if (err) {
                        console.log(err)
                        return reje('Internal server error')
                    }
            })
            }
            reso(true)
        })
        })
        try {
        const isOtpChecked = await otpCheck
        if (isOtpChecked) {
        const otp = await generateOtp()
        db.query(`insert into otp (u_id, code) value (?, ?)`, [email, otp], async (error) => {
            if (error) {
                console.error(error)
                return reject("Otp processing error!")
            }
            console.log(otp)
            try {
            var isMailSent = await sendMail({email: email, otp: otp}, "Varify Otp")
            } catch (e) {
            var isMailSent = e.message
            }
            console.log(isMailSent)
            return resolve(isMailSent)
        })
    }
    } catch (e) {
        reject(e.message)
    }
    })
}
module.exports = newOtp