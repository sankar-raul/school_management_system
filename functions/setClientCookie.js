const { resolve } = require("path")
const setCookie = (res, status) => {
    return new Promise((resolve, reject) => {
        res.cookie('u_id', status.u_id, { expires: new Date(Date.now() + status.ex), httpOnly: true })
        res.cookie('security_key', status.newSecurityKey, { expires: new Date(Date.now() + status.ex), httpOnly: true })
        resolve(true)
    })
}
module.exports = setCookie