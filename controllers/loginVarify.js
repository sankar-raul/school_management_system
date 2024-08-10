const db = require('../dbConnections/sqldb')
const setCookie = require('../functions/setClientCookie')
const createCookie = require('../functions/createCookie')
const varifyLogin = async ({u_type,data,res}) => {
        const database = user => user == "admin" ? "admin" : user + 's'
        db.query(`select password from ${database(u_type)} where email = ?`, [data.email, data.password], async (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).send('data fetching error!')
            }
            if (!result[0]) {
                return res.status(401).send('Account not Found!')
            }
            if (result[0].password == data.password) {
                const status = await createCookie({u_id: data.email, u_type: u_type, ex: 10})
                if (status == 'error') return res.status(500).send('cookie inserting error!')
                    console.log(status)
                // res.cookie('u_id', status.u_id, { expires: new Date(Date.now() + status.ex), httpOnly: true })
                // res.cookie('security_key', status.newSecurityKey, { expires: new Date(Date.now() + status.ex), httpOnly: true })
                await setCookie(res, status)
                res.send('refresh')
            } else {
                res.status(401).send("Incorrect password!")
            }
        })
}
module.exports = varifyLogin