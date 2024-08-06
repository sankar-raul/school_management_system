const db = require('../dbConnections/sqldb')

const forgotGet = (req, res) => {
    if (req.isLogedin) {
        return res.redirect('/dashboard')
    }
    res.render("forgot", {u_type: "Admin"})
}
module.exports = forgotGet