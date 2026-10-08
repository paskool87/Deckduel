const connection = require("../database");
const bcrypt = require("bcrypt");

const getUsers = (callback) => {
    connection.query(
        "SELECT id_users, username, email FROM users",
        (error, results) => {
            if (error) {
                return callback(error);
            }

            callback(null, results);
        }
    );
};

const createUser = (username, email, password, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    connection.beginTransaction((error) => {
        if (error) {
            return callback(error);
        }

        const userSql = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        `;

        connection.query(
            userSql,
            [username, email, hashedPassword],
            (error, userResult) => {
                if (error) {
                    return connection.rollback(() => {
                        callback(error);
                    });
                }

                const userId = userResult.insertId;

                const deckSql = `
                    INSERT INTO decks (user_id, name)
                    VALUES (?, ?)
                `;

                connection.query(
                    deckSql,
                    [userId, "Deck sans nom"],
                    (error, deckResult) => {
                        if (error) {
                            return connection.rollback(() => {
                                callback(error);
                            });
                        }

                        const deckId = deckResult.insertId;

                        const cards = [];

                        for (let i = 0; i < 20; i++) {
                            cards.push([
                                deckId,
                                50,
                                30,
                                20,
                                null
                            ]);
                        }

                        const cardsSql = `
                            INSERT INTO cards (
                                deck_id,
                                health,
                                attack,
                                defense,
                                special_ability_id
                            )
                            VALUES ?
                        `;

                        connection.query(
                            cardsSql,
                            [cards],
                            (error) => {
                                if (error) {
                                    return connection.rollback(() => {
                                        callback(error);
                                    });
                                }

                                connection.commit((error) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            callback(error);
                                        });
                                    }

                                    callback(null, {
                                        id_users: userId,
                                        username,
                                        email,
                                        id_decks: deckId
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};

module.exports = {
    getUsers,
    createUser,
};