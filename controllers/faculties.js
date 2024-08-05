const db = require("../dbConnections/sqldb")
const getAllFaculties = (req, res) => {
    db.query(`select * from faculties`, (err, result) => {
        if (err) {
            console.log(err)
            return res.send('error')
        }
        return res.json(result)
    })
}
module.exports = { getAllFaculties }