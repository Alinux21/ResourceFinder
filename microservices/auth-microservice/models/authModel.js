const path = require('path');
const { connectToDatabase } = require('../config/DbConfig');
const con = connectToDatabase();

function findUser(username, password) {
    return new Promise((resolve, reject) => {
        var sql = "select password from users where username = ?";
        sql = con.format(sql, username);

        const [rows] = connection.execute(sql);
        if (rows.length != 1) {
            return false;
        } else {
            if (rows[0].password == password) {
                return true;
            } else {
                return false;
            }
        }
        
    })
}

module.exports = {
    findUser
}
