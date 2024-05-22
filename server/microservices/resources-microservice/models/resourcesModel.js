const path = require('path');
const { connectToDatabase } = require('../config/db-config');
const con = connectToDatabase();

function findAll() {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM resources"
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                resolve(result);
            }
        });
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM resources WHERE id=?";
        sql = con.format(sql, id);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                resolve(result);
            }
        });
    })
}

function create(resource) {
    return new Promise((resolve, reject) => {

        var keys = Object.keys(resource);
        var values = Object.values(resource).map(value => Array.isArray(value) ? value.join(',') : value);//convert the tag array to a string
        var placeholders = keys.map(() => '?').join(',');

        var sql = `INSERT INTO resources (${keys.join(',')}) VALUES (${placeholders})`;
        con.query(sql, values, function (err, result) {
            if (err) reject(err);
            console.log("1 record inserted");

            var sql = 'SELECT * FROM resources ORDER BY id DESC LIMIT 1';

            con.query(sql, function (err, result) {
                if (err) reject(err);
                var id = result[0] ? result[0].id : undefined;
                console.log(id);

                const newResource = { ...resource, id };
                console.log(newResource);
                resolve(newResource);
            });
        });
    });
}


function update(id, resourceData) {
    return new Promise((resolve, reject) => {
        var keys = [];
        var values = [];

        for (let key in resourceData) {
            if (resourceData[key]) {
                keys.push(key);
                values.push(resourceData[key]);
            }
        }

        values.push(id);//adding the id for the where clause

        var setClause = keys.map((key) => `${key} = ?`).join(', ');
        var sql = `UPDATE resources SET ${setClause} WHERE id = ?`;

        sql = con.format(sql, values);

        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("1 record updated");

            const updatedResource = findById(id);
            resolve(updatedResource);
        });
    });
}

function deleteRes(id){
        return new Promise((resolve, reject) => {
        var sql = "DELETE FROM resources WHERE id=?";
        sql = con.format(sql, id);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("DELETE performed!");
                resolve(result);
            }
        });
    })
}


module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteRes
}