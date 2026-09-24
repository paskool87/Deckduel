const connection = require("../database");
const bcrypt = require("bcrypt");

const getUsers = (callback) => {
    connection.query("SELECT * FROM users", (error, results) => {
        if (error) {
            return callback(error);
        }

        callback(null, results);
    });
};

const createUser = (username, email, password, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;

    connection.query(
        sql,
        [username, email, hashedPassword],
        (error, result) => {
            if (error) {
                return callback(error);
            }

            callback(null, {
                id_users: result.insertId,
                username,
                email
            });
        }
    );
};

module.exports = {
    getUsers,
    createUser
};