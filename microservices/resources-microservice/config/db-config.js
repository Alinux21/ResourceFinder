var mysql = require('mysql');


var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'refi_resources'
});

const connectToDatabase = () => {

    con.connect(function (err) {
        console.log("Connected to database!");
    });

    return con;
}

module.exports = {
    connectToDatabase
}