const bcrypt = require('bcrypt')
const salt = 7;
const encrypt = async (password) => {
    return await bcrypt.hash(password, salt)
}
const decrypt = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}
module.exports = {encrypt, decrypt}