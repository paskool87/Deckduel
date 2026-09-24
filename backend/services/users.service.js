const connection = require("../database");

const getUsers = (callback) => {
    connection.query("SELECT * FROM users", (error, results) => {
        if (error) {
            return callback(error);
        }

        callback(null, results);
    });
};

module.exports = {
    getUsers
};