const db = require('../dbConnections/sqldb')
const changePassword = (email, u_type, password) => {
    const validTypes = {admin: 'admin', student: 'students', faculty: 'faculties'}
    return new Promise((resolve, reject) => {
                db.query(`update ${validTypes[u_type]} set password = ? where email = ?`, [password, email], (error) => {
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