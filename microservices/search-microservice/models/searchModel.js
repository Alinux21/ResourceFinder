const path = require('path');
const { connectToDatabase } = require('../config/db-config');
const con = connectToDatabase();

function getResourcesByWords(specialWords) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        const conditions = specialWords.map(() => ` tags LIKE ?`);
        sql += conditions.join(" OR ");
        
        const values = specialWords.map(word => `%${word}%`);

        con.query(sql, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                resolve(result);
            }
        });
    });
}

function getEspeciallyResourcesByWords(specialWords) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        const conditions = specialWords.flatMap(word => [` tags LIKE ?`, `title LIKE ?`]);
        sql += conditions.join(" AND ");
        
        const values = specialWords.flatMap(word => [`%${word}%`, `%${word}%`]);

        con.query(sql, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                resolve(result);
            }
        });
    });
}

function getAllExceptSpecialWords(specialWords) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        const conditions = specialWords.flatMap(word => [` tags NOT LIKE ?`, `title NOT LIKE ?`]);
        sql += conditions.join(" AND ");
        
        const values = specialWords.flatMap(word => [`%${word}%`, `%${word}%`]);

        con.query(sql, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                resolve(result);
            }
        });
    });
}

function getResourcesByGroups(positiveGroup, negativeGroup, specializedDictionary) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";

        // Generate conditions for positive group using OR
        const positiveConditions = positiveGroup.flatMap(group => {
            const words = group.split(' ');
            const specializedWords = words.filter(word => specializedDictionary.includes(word.toLowerCase()));
            return specializedWords.map(word => `( tags LIKE ? AND title LIKE ? )`);
        });

        // Generate conditions for negative group using AND
        const negativeConditions = negativeGroup.flatMap(group => {
            const words = group.split(' ');
            const specializedWords = words.filter(word => specializedDictionary.includes(word.toLowerCase()));
            return specializedWords.map(word => `( tags NOT LIKE ? AND title NOT LIKE ? )`);
        });

        // Combine conditions with proper grouping
        let conditions = "";
        if (positiveConditions.length > 0) {
            conditions += `(${positiveConditions.join(' OR ')})`;
        }
        if (negativeConditions.length > 0) {
            if (conditions) {
                conditions += ` AND ${negativeConditions.join(' AND ')}`;
            } else {
                conditions += negativeConditions.join(' AND ');
            }
        }

        sql += ` ${conditions}`;

        const positiveValues = positiveGroup.flatMap(group => {
            const words = group.split(' ');
            const specializedWords = words.filter(word => specializedDictionary.includes(word.toLowerCase()));
            return specializedWords.flatMap(word => [`%${word}%`, `%${word}%`]);
        });

        const negativeValues = negativeGroup.flatMap(group => {
            const words = group.split(' ');
            const specializedWords = words.filter(word => specializedDictionary.includes(word.toLowerCase()));
            return specializedWords.flatMap(word => [`%${word}%`, `%${word}%`]);
        });

        const values = [...positiveValues, ...negativeValues];

        const formattedSql = formatSql(sql, values);
        console.log("Formatted SQL: ", formattedSql);

        con.query(sql, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Select performed!");
                resolve(result);
            }
        });
    });
}

// Helper function to format the SQL query for debugging purposes
function formatSql(sql, values) {
    return sql.replace(/\?/g, () => {
        const value = values.shift();
        return typeof value === 'string' ? `'${value}'` : value;
    });
}


module.exports = {
    getResourcesByWords,
    getEspeciallyResourcesByWords,
    getAllExceptSpecialWords,
    getResourcesByGroups
}