const path = require('path');
const { connectToDatabase } = require('../config/DbConfig');
const con = connectToDatabase();

function checkUser(username, password) {
    return new Promise((resolve, reject) => {
        var sql = "select password from users_info where userName=?";
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

function createUser(firstName, lastName, country, city, emailAdress, phoneNumber, userName, password) {
    return new Promise((resolve, reject) => {
        var sql = "insert into users_info (firstName, lastName, country, city, emailAdress, phoneNumber, userName, password) values (?,?,?,?,?,?,?,?)";
        sql = con.format(sql, [firstName, lastName, country, city, emailAdress, phoneNumber, userName, password]);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });   
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        var sql = "select * from users_info where userName=?";
        sql = con.format(sql, username);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

function updateUser(firstName, lastName, country, city, emailAdress, phoneNumber, newPassword, username) {
    return new Promise((resolve, reject) => {
        var sql = "update users_info set firstName=?, lastName=?, country=?, city=?, emailAdress=?, phoneNumber=?, password=? where userName=?";
        sql = con.format(sql, [firstName, lastName, country, city, emailAdress, phoneNumber, newPassword, username]);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

module.exports = {
    checkUser,
    createUser,
    getUser,
    updateUser
}
