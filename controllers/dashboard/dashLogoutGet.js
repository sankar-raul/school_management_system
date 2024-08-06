const deleteCookie = require('../../functions/deleteCookie')
const dashLogoutGet = (req, res) => {
    deleteCookie(req.cookies)
    res.cookie('u_id', '', {expires: new Date(0), httpOnly: true})
    res.cookie('security_key', '', {expires: new Date(0), httpOnly: true})
    res.redirect('/dashboard/login')
}
module.exports = dashLogoutGet