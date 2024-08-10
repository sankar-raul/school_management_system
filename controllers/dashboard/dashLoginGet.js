const db = require('../../dbConnections/sqldb')

const dashLoginGet = (req, res) => {
    // console.log(req.isLogedin)
    if (req.isLogedin) {
        return res.redirect('/dashboard')
    }
    res.render('login', {u_type: "Admin"})
}

module.exports = dashLoginGet