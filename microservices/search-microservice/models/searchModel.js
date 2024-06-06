const path = require('path');
const { connectToDatabase } = require('../config/db-config');
const con = connectToDatabase();

function getResourcesByWords(specialWords, limit, offset) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        const conditions = specialWords.map(() => ` tags LIKE ?`);
        sql += conditions.join(" OR ");
        sql += " LIMIT ? OFFSET ?";

        const values = [...specialWords.map(word => `%${word}%`), limit, offset];

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

function getSpeciallisedResources(specialWords, limit, offset) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        const conditions = specialWords.flatMap(word => [` tags LIKE ?`, `title LIKE ?`]);
        sql += conditions.join(" AND ");
        sql += " LIMIT ? OFFSET ?";

        const values = [...specialWords.flatMap(word => [`%${word}%`, `%${word}%`]), limit, offset];

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

function getAllExceptSpecialWords(specialWords, limit, offset) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        const conditions = specialWords.flatMap(word => [` tags NOT LIKE ?`, `title NOT LIKE ?`]);
        sql += conditions.join(" AND ");
        sql += " LIMIT ? OFFSET ?";

        const values = [...specialWords.flatMap(word => [`%${word}%`, `%${word}%`]), limit, offset];

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

function getResourcesByGroups(positiveGroup, negativeGroup, specializedDictionary, limit, offset) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM resources WHERE";
        
        const positiveConditions = positiveGroup.flatMap(group => {
            const words = group.split(' ');
            const specializedWords = words.filter(word => specializedDictionary.includes(word.toLowerCase()));
            return specializedWords.map(word => `(tags LIKE ? AND title LIKE ?)`);
        });

        const negativeConditions = negativeGroup.flatMap(group => {
            const words = group.split(' ');
            const specializedWords = words.filter(word => specializedDictionary.includes(word.toLowerCase()));
            return specializedWords.map(word => `(tags NOT LIKE ? AND title NOT LIKE ?)`);
        });

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

        if (!conditions) {
            conditions = "1";
        }

        sql += ` ${conditions}`;
        sql += " LIMIT ? OFFSET ?";

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

        const values = [...positiveValues, ...negativeValues, limit, offset];

        console.log("Constructed SQL: ", sql);
        console.log("Values: ", values);

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


function formatSql(sql, values) {
    return sql.replace(/\?/g, () => {
        const value = values.shift();
        return typeof value === 'string' ? `'${value}'` : value;
    });
}

module.exports = {
    getResourcesByWords,
    getAllExceptSpecialWords,
    getResourcesByGroups,
    getSpeciallisedResources
}
