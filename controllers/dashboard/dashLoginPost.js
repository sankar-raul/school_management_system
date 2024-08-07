const db = require('../../dbConnections/sqldb')
const createCookie = require('../../functions/createCookie')
const dashLoginPost = (req, res) => {
    if (req.isLogedin) {
        return res.redirect('/dashboard')
    }
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(502).send('email and password is required!')
    }
    db.query(`select password from admin where email = ? AND password = ?`, [email, password], async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('data fetching error!')
        }
        if (!result[0]) 
            return res.status(401).send('Account not Found!')
        if (result[0]) {
            const status = await createCookie({u_id: email, u_type: 'admin', ex: 10})
            if (status == 'error') return res.status(500).send('cookie inserting error!')
                console.log(status)
            res.cookie('u_id', status.u_id, { expires: new Date(Date.now() + status.ex), httpOnly: true })
            res.cookie('security_key', status.newSecurityKey)
            return res.send('refresh')
        } else {
            res.status(401).send("Incorrect password!")
        }
    })
}
module.exports = dashLoginPost