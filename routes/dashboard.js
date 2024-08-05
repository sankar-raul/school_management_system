const express = require('express')
const db = require('../dbConnections/sqldb')
const createCookie = require('../functions/createCookie')
const dash = express.Router()
dash.post('/login', (req, res) => {
    if (req.isLogedin) {
        return res.redirect('/dashboard')
    }
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(502).send('email and password is required!')
    }
    db.query(`select password from admin where email = '${email}'`, async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('data fetching error!')
        }
        if (result == 0) return res.status(401).send('Account not Found!')
        if (result[0].password == password) {
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
})
dash.get('/login', (req, res) => {
    console.log(req.isLogedin)
    if (req.isLogedin) {
        return res.redirect('/dashboard')
    }
    res.render('adminLogin')
})
dash.use((req, res, next) => {
    if (req.isLogedin) {
        next()
    } else {
        res.redirect('/dashboard/login')
    }
})

dash.get('/', (req, res) => {
    res.render('dashboard')
})
dash.get('/logout', (req, res) => {
    res.cookie('u_id', '', {expires: new Date(0), httpOnly: true})
    res.cookie('security_key', '', {expires: new Date(0), httpOnly: true})
    res.redirect('/dashboard/login')
})
module.exports = dash