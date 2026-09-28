const connection = require("../database");

const createCard = (
    userId,
    deckId,
    health,
    attack,
    defense,
    callback
) => {
    const checkSql = `
        SELECT id_decks
        FROM decks
        WHERE id_decks = ?
    `;

    connection.query(checkSql, [deckId], (error, results) => {
        if (error) {
            return callback(error);
        }

        if (results.length === 0) {
            return callback({
                code: "DECK_NOT_FOUND"
            });
        }

        const ownerSql = `
            SELECT id_decks
            FROM decks
            WHERE id_decks = ?
            AND user_id = ?
        `;

        connection.query(
            ownerSql,
            [deckId, userId],
            (error, results) => {
                if (error) {
                    return callback(error);
                }

                if (results.length === 0) {
                    return callback({
                        code: "DECK_NOT_ALLOWED"
                    });
                }

                const countSql = `
                    SELECT COUNT(*) AS cardCount
                    FROM cards
                    WHERE deck_id = ?
                `;

                connection.query(
                    countSql,
                    [deckId],
                    (error, results) => {
                        if (error) {
                            return callback(error);
                        }

                        if (results[0].cardCount >= 20) {
                            return callback({
                                code: "DECK_FULL"
                            });
                        }

                        const sql = `
                            INSERT INTO cards (
                                deck_id,
                                health,
                                attack,
                                defense
                            )
                            VALUES (?, ?, ?, ?)
                        `;

                        connection.query(
                            sql,
                            [deckId, health, attack, defense],
                            (error, result) => {
                                if (error) {
                                    return callback(error);
                                }

                                callback(null, {
                                    id_cards: result.insertId,
                                    deck_id: deckId,
                                    health,
                                    attack,
                                    defense
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
    createCard
};