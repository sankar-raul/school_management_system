const db = require('../dbConnections/sqldb')
const generateOtp = require('../functions/generateOtp')
const forget = (req, res) => {
    res.send("ok")
}
module.exports = forget