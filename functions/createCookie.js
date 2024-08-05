const db = require('../dbConnections/sqldb')
const charset = "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWX"
const newKey = (size = 30) => {
    let pass = '', cLength = charset.length - 1
    while (size--) {
        pass += charset.charAt(Math.round(Math.random() * cLength))
    }
    return pass;
}
const createCookie = async ({u_id, u_type, ex = 10}) => {
    if (!u_id || !u_type) {
        console.log("u_id and u_type required!")
        return 'required'
    }
    ex = ex * 60000
    const newSecurityKey = newKey()
    db.query(`insert into sessions (u_id, security_key, u_type, expiry) values (?, ?, ?, ?)`, [u_id, newSecurityKey, u_type, new Date(Date.now() + ex)], (error, result) => {
        if (error) {
            console.log(error, `Error ocurred at -> insert into sessions`)
            return 'error'
        }
    })
    return {newSecurityKey, u_id, ex}
}
module.exports = createCookie