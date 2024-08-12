const db = require('../dbConnections/sqldb')
const getAllDept = () => {
    return new Promise((resolve, reject) => {
        db.query(`select id, dept_name, duration from department`, (error, result) => {
            if (error) {
                reject(error.message)
            } else {
                resolve(result)
            }
        })
    })
}
module.exports = getAllDept