const generateOtp = (length = 6) => {
    let otp = ''
    while (length--) {
        otp += Math.round(Math.random() * 9)
    }
    return otp
}
module.exports = generateOtp