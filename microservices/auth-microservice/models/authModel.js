const path = require('path');
const { connectToDatabase } = require('../config/DbConfig');
const con = connectToDatabase();

function checkUser(username, password) {
    return new Promise((resolve, reject) => {
        var sql = "select password from users_info where username = ?";
        sql = con.format(sql, username);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else if (result.length !== 1) {
                resolve(false);
            }
            else if (result[0].password === password) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

module.exports = {
    checkUser
}
