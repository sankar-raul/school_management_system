const db = require('../dbConnections/sqldb')
const varifyOtp = async (email, otp) => {
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
module.exports = varifyOtp