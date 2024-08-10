const deleteCookie = require('../../functions/deleteCookie')
const dashLogoutGet = async (req, res) => {
    await deleteCookie(req.cookies, res)
    res.redirect('/dashboard/login')
}
module.exports = dashLogoutGet