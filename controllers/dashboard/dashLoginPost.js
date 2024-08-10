const db = require('../../dbConnections/sqldb')
const createCookie = require('../../functions/createCookie')
const varifyLogin = require('./../loginVarify')
const dashLoginPost = (req, res) => {
    if (req.isLogedin) {
        return res.redirect('/dashboard')
    }
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(502).send('email and password is required!')
    }
    varifyLogin({u_type: 'admin', data: {email, password}, req, res})
}
module.exports = dashLoginPost