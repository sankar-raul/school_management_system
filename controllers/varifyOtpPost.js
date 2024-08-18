const db = require('../dbConnections/sqldb')
const changePassword = require('../functions/changePassword')
const createCookie = require('../functions/createCookie')
const varifyOtp = require('../functions/varifyOtp')
const varifyOtpAndChangePass = async (req, res) => {
    const { otp, email, newPassword, u_type } = req.body
    if (!otp || !email) {
        return res.end('email and otp required')
    }
    try {
    const varified = await varifyOtp(email, otp)
    if (varified == 'expired') {
        return res.end("Otp expired! Please request for a new otp")
    }
    if (varified) {
        if (newPassword) {
            const isPasswordChanged = await changePassword(email, u_type, newPassword)
            if (isPasswordChanged) {
                const status = await createCookie({u_id: email, u_type: u_type, ex: 10})
                if (status == 'error') return res.status(500).send('cookie inserting error!')
                    console.log(status)
                res.cookie('u_id', status.u_id, { expires: new Date(Date.now() + status.ex), httpOnly: true })
                res.cookie('security_key', status.newSecurityKey, { expires: new Date(Date.now() + status.ex), httpOnly: true })
                return res.end('refresh')
            } else {
                return res.end('Error: Password not changed!')
            }
        }
    } else {
        return res.end('Invalid Otp!')
    }
} catch (e) {
    res.status(500).json({err: e.message})
}
}
module.exports = varifyOtpAndChangePass