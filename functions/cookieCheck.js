const db = require('../dbConnections/sqldb')

const isValid = ({u_id, security_key}) => {
    return new Promise((resolve, reject) => {
        db.query(`select u_id from sessions where u_id = ? and security_key = ?`, [u_id, security_key], (error, result) => {
            if (error) {
                console.log(error, `error -> select u_id from sessions where u_id = ? and security_key = ?`)
                reject(error)
            }
            if (result[0]) {
                resolve(true)
            } else {
            resolve(false)
            }
        })
    })
}

const cookieCheck = async (req, res, next) => {
    const cookies = Object.keys(req.cookies)
    req.cookies.keys = cookies;
    // console.log(req.cookies)
    let isLogedin = false
    if (req.cookies.u_id && req.cookies.security_key) {
        isLogedin = await isValid(req.cookies)
    }
    req.isLogedin = isLogedin
    next()
}
module.exports = cookieCheck