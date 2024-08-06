const db = require('../dbConnections/sqldb')
const deleteCookie = async (cookie) => {
    db.query(`delete from sessions where u_id = ? and security_key = ?`, [cookie.u_id, cookie.security_key], (error) => {
        if (error) console.log(error, `error -> delete from sessions where u_id = ? and security_key = ?`)
    })
}
module.exports = deleteCookie