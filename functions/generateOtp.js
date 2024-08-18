const generateOtp = async (length = 6) => {
    return new Promise((resolve, reject) => {
        let otp = ''
        while (length--) {
            otp += Math.round(Math.random() * 9)
        }
        resolve(otp)
    })
}
module.exports = generateOtp