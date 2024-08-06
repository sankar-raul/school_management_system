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
    const newSecurityKey = newKey()
    db.query(`insert into sessions (u_id, valid_till,security_key, u_type) values (?, ?, ?, ?)`, [u_id, ex, newSecurityKey, u_type], (error, result) => {
        if (error) {
            console.log(error, `Error ocurred at -> insert into sessions`)
            return 'error'
        }
    })
    ex = ex * 60000
    return {newSecurityKey, u_id, ex}
}
module.exports = createCookie