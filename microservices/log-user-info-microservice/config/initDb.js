var mysql = require('mysql');
var fs = require('fs');

function createDatabase() {
    return new Promise((resolve, reject) => {

        var initDatabaseCon = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        initDatabaseCon.connect(function (err) {
            if (err) return reject(err);
            console.log("Connected!");

            initDatabaseCon.query("DROP DATABASE IF EXISTS users", function (err, result) {
                if (err) return reject(err);
                console.log("Database dropped");

                initDatabaseCon.query("CREATE DATABASE users", function (err, result) {
                    if (err) return reject(err);
                    console.log("Database created");
                    initDatabaseCon.end(function (err) {
                        if (err) {
                            return reject('error:' + err.message);
                        }
                        console.log('Close the database connection.');
                        resolve();
                    });
                });
            });
        });

    });
}

function createTable() {
    return new Promise((resolve, reject) => {
        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'users'
        });

        con.connect(function (err) {
            if (err) return reject(err);
            console.log("Connected!");

            var sql = "CREATE TABLE users_info (id INT AUTO_INCREMENT PRIMARY KEY, userName VARCHAR(200), password VARCHAR(200), firstName VARCHAR(200), lastName VARCHAR(200), phoneNumber VARCHAR(200), emailAdress VARCHAR(200), country VARCHAR(200), city VARCHAR(200));";

            con.query(sql, function (err, result) {
                if (err) return reject(err);
                console.log("Table created");
            });

            var obj = JSON.parse(fs.readFileSync('users.json', 'utf8'));

            obj.users.forEach(function (resource) {
                var keys = Object.keys(resource);
                var values = Object.values(resource).map(value => Array.isArray(value) ? value.join(',') : value);

                var placeholders = keys.map(() => '?').join(',');

                var sql = `INSERT INTO users_info (${keys.join(',')}) VALUES (${placeholders})`;

                con.query(sql, values, function (err, result) {
                    if (err) return reject(err);
                    console.log("1 record inserted");
                });
            });

            con.end(function (err) {
                if (err) {
                    return reject('error:' + err.message);
                }
                console.log('Close the database connection.');
                resolve();
            });
        });
    })
}

createDatabase()
    .then(() => createTable())
    .catch(console.error);
