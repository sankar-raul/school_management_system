const db = require('../dbConnections/sqldb')
const deleteCookie = async (cookie, res) => {
    res.cookie('u_id', '', {expires: new Date(0), httpOnly: true})
    res.cookie('security_key', '', {expires: new Date(0), httpOnly: true})
    db.query(`delete from sessions where u_id = ? and security_key = ?`, [cookie.u_id, cookie.security_key], (error) => {
        if (error) console.log(error, `error -> delete from sessions where u_id = ? and security_key = ?`)
    })
}
module.exports = deleteCookie