var mysql = require('mysql');

function createDatabase() {
    return new Promise((resolve, reject) => {

        var initDatabaseCon = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        initDatabaseCon.connect(function (err) {
            if (err) reject(err);
            console.log("Connected!");

            initDatabaseCon.query("DROP DATABASE IF EXISTS refi_resources", function (err, result) {
                if (err) reject(err);
                console.log("Database dropped");
            });

            initDatabaseCon.query("CREATE DATABASE refi_resources", function (err, result) {
                if (err) reject(err);
                console.log("Database created");
                resolve();
            });

            initDatabaseCon.end(function (err) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Close the database connection.');
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
            database: 'refi_resources'
        });

        con.connect(function (err) {
            console.log("Connected!");

            var sql = "CREATE TABLE resources (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL,summary VARCHAR(255),description VARCHAR(2000),tags VARCHAR(255),link VARCHAR(255) NOT NULL,posted_by VARCHAR(255),is_book BOOLEAN DEFAULT FALSE,is_online_book BOOLEAN DEFAULT FALSE,is_course BOOLEAN DEFAULT FALSE,is_framework BOOLEAN DEFAULT FALSE,is_visual_programming_language BOOLEAN DEFAULT FALSE,is_sound_programming_language BOOLEAN DEFAULT FALSE,is_web_programming_library BOOLEAN DEFAULT FALSE,is_hardware BOOLEAN DEFAULT FALSE,is_video BOOLEAN DEFAULT FALSE,is_tutorial BOOLEAN DEFAULT FALSE,is_machine_learning BOOLEAN DEFAULT FALSE,is_blog BOOLEAN DEFAULT FALSE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);";

            con.query(sql, function (err, result) {
                if (err) reject(err);
                console.log("Table created");
            });

            var fs = require('fs');
            var obj = JSON.parse(fs.readFileSync('resources.json', 'utf8'));



            //dinamycally insert the resources into the database
            obj.resources.forEach(function (resource) {
            
                var keys = Object.keys(resource);
                var values = Object.values(resource).map(value => Array.isArray(value) ? value.join(',') : value);//convert the tag array to a string
            
                //preparing the placeholders that hold the values
                var placeholders = keys.map(() => '?').join(',');
            
                var sql = `INSERT INTO resources (${keys.join(',')}) VALUES (${placeholders})`;
            
                con.query(sql, values, function (err, result) {
                    if (err) reject(err);
                    console.log("1 record inserted");
                });
            });

            con.end(function (err) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Close the database connection.');
            });
            

        });

    })
}

createDatabase().then(createTable).catch(console.error);