const db = require('../dbConnections/sqldb')
const {encrypt} = require('./password')
const changePassword = (email, u_type, password) => {
    const validTypes = {admin: 'admin', student: 'students', faculty: 'faculties'}
    return new Promise(async (resolve, reject) => {
        const passhash = await encrypt(password)
                db.query(`update ${validTypes[u_type]} set password = ? where email = ?`, [passhash, email], (error) => {
                    if (error) {
                        console.error(error)
                        reject(error)
                    } else {
                        resolve(true)
                    }
                })
    })
}
module.exports = changePassword