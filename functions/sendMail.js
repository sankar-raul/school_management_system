const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sankar@sankar.tech',
      pass: '@@@@Sankar1@@@@'
    }
  });
const sendMail = (data, subject = null) => {
    console.log(subject)
    return new Promise((resolve, reject) => {
    switch (subject) {
        case "Varify Otp":
            transporter.sendMail({
                from: 'sankar@sankar.tech',
                to: data.email,
                subject: subject,
                html: `<h1>Your otp is ${data.otp}</h1>`
            }, (error, info) => {
                if (error) {
                    console.error(error)
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