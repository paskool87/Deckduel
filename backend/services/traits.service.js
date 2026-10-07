const connection = require("../database");

const getTraits = (callback) => {
    const sql = `
        SELECT
            id_traits,
            name,
            description
        FROM traits
        ORDER BY id_traits
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            return callback(error);
        }

        callback(null, results);
    });
};

module.exports = {
    getTraits
};