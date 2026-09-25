const bcrypt = require("bcrypt");
const connection = require("../database");

const login = (email, password, callback) => {
    const sql = `
        SELECT id_users, username, email, password
        FROM users
        WHERE email = ?
    `;

    connection.query(sql, [email], (error, results) => {
        if (error) {
            return callback(error);
        }

        if (results.length === 0) {
            return callback(null, null);
        }

        const user = results[0];

        const isValidPassword = bcrypt.compareSync(
            password,
            user.password
        );

        if (!isValidPassword) {
            return callback(null, null);
        }

        callback(null, {
            id_users: user.id_users,
            username: user.username,
            email: user.email
        });
    });
};

module.exports = {
    login
};