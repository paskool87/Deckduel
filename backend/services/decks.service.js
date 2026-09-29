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

const getDeckById = (userId, deckId, callback) => {
    const sql = `
        SELECT id_decks, user_id, name, created_at
        FROM decks
        WHERE id_decks = ?
        AND user_id = ?
    `;

    connection.query(sql, [deckId, userId], (error, results) => {
        if (error) {
            return callback(error);
        }

        if (results.length === 0) {
            return callback({
                code: "DECK_NOT_FOUND"
            });
        }

        const deck = results[0];

        const cardsSql = `
            SELECT
                id_cards,
                deck_id,
                health,
                attack,
                defense,
                special_ability_id
            FROM cards
            WHERE deck_id = ?
        `;

        connection.query(cardsSql, [deckId], (error, cards) => {
            if (error) {
                return callback(error);
            }

            deck.cards = cards;

            const traitsSql = `
                SELECT
                    dt.trait_id,
                    t.name,
                    t.description,
                    dt.intensity
                FROM deck_traits dt
                INNER JOIN traits t
                    ON dt.trait_id = t.id_traits
                WHERE dt.deck_id = ?
            `;

            connection.query(
                traitsSql,
                [deckId],
                (error, traits) => {
                    if (error) {
                        return callback(error);
                    }

                    deck.traits = traits;

                    callback(null, deck);
                }
            );
        });
    });
};

const updateDeck = (userId, deckId, name, callback) => {
    const sql = `
        UPDATE decks
        SET name = ?
        WHERE id_decks = ?
        AND user_id = ?
    `;

    connection.query(
        sql,
        [name, deckId, userId],
        (error, result) => {
            if (error) {
                return callback(error);
            }

            if (result.affectedRows === 0) {
                return callback({
                    code: "DECK_NOT_FOUND"
                });
            }

            callback(null, {
                id_decks: Number(deckId),
                user_id: userId,
                name
            });
        }
    );
};

module.exports = {
    getDecks,
    createDeck,
    getDeckById,
    updateDeck
};