const path = require('path');
const { connectToDatabase } = require('../config/db-config');
const { rejects } = require('assert');
const con = connectToDatabase();

function findUser(username, password) {
    return new Promise((resolve, reject) => {
        var sql = "select password from users where username = ?";
        sql = con.format(sql, username);

        const [rows] = connection.execute(sql);
        if (rows.length === 0) {
            return null;
        }
        return rows[0].password;

        

    })
}
