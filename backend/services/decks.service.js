const connection = require("../database");

const getDecks = (userId, callback) => {
    const sql = `
        SELECT id_decks, user_id, name, created_at
        FROM decks
        WHERE user_id = ?
    `;

    connection.query(sql, [userId], (error, results) => {
        if (error) {
            return callback(error);
        }

        callback(null, results);
    });
};

const createDeck = (userId, name, callback) => {
    const checkSql = `
        SELECT id_decks
        FROM decks
        WHERE user_id = ?
    `;

    connection.query(checkSql, [userId], (error, results) => {
        if (error) {
            return callback(error);
        }

        if (results.length > 0) {
            return callback({
                code: "DECK_ALREADY_EXISTS"
            });
        }

        const sql = `
            INSERT INTO decks (user_id, name)
            VALUES (?, ?)
        `;

        connection.query(
            sql,
            [userId, name],
            (error, result) => {
                if (error) {
                    return callback(error);
                }

                callback(null, {
                    id_decks: result.insertId,
                    user_id: userId,
                    name
                });
            }
        );
    });
};

module.exports = {
    getDecks,
    createDeck
};