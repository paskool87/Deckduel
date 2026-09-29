const connection = require("../database");

const getSpecialAbilities = (callback) => {
    const sql = `
        SELECT
            id_special_abilities,
            name,
            description
        FROM special_abilities
        ORDER BY id_special_abilities
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }

        callback(null, results);
    });
};

module.exports = {
    getSpecialAbilities
};