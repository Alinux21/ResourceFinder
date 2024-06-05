const path = require('path');
const { connectToDatabase } = require('../config/db-config');
const con = connectToDatabase();
const fs = require('fs');


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

                var sql = "UPDATE resources SET clicks = clicks + 1 WHERE id=?";
                sql = con.format(sql, id);

                con.query(sql, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Update performed!");
                    }
                });

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

function deleteRes(id) {
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

function saveImage(image) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const path = require('path');
        

        // Define the path where the file should be saved
        const savePath = path.join(__dirname, '../assets/resource-images', image.originalname.replace(/\s/g, '_'));

        // Create a write stream
        const fileStream = fs.createWriteStream(savePath);

        // Pipe the file data to the write stream
        fileStream.write(image.buffer);

        // Handle the 'finish' event
        fileStream.on('finish', () => {
            console.log('File saved successfully');
            resolve(image.originalname);
        });

        // Handle the 'error' event
        fileStream.on('error', (err) => {
            console.error('Error saving file:', err);
            reject(err);
        });

        // Close the stream
        fileStream.end();
    });
}

function getImage(imageName, res){
    return new Promise((resolve, reject) => {
        var sql = "SELECT COUNT(*) FROM resources WHERE image_src=?";
        sql = con.format(sql, imageName);
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                console.log(result);
                if(result[0]['COUNT(*)'] >= 1){
                    const imagePath = path.join(__dirname, '../assets/resource-images', imageName);
                    fs.readFile(imagePath, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    resolve(null);
                }
            }
        });
    });
}

function findByUser(username) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM resources WHERE posted_by=?";
        sql = con.format(sql, username);
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

function findPopularResources(){
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM resources ORDER BY clicks DESC LIMIT 5";
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

function findLatestResources() {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM resources ORDER BY created_at DESC LIMIT 5";
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


module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteRes,
    saveImage,
    getImage,
    findByUser,
    findPopularResources,
    findLatestResources
}