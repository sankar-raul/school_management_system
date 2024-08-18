const transporter = require('./mailTransporter')
require('dotenv').config()
const sendMail = (data, subject = null) => {
    console.log(subject)
    return new Promise((resolve, reject) => {
    switch (subject) {
        case "Varify Otp":
            transporter.sendMail({
                from: 'sankar@sankar.tech',
                to: data.email,
                subject: subject,
                html: `<h1>${subject} ${data.otp}</h1>`
            }, (error, info) => {
                if (error) {
                    console.log(error)
                    reject(false)
                } else {
                    resolve(true)
                }
            })
            break;
        default:
            resolve("invalid subject")
}
})
}
module.exports = sendMail