const connection = require("../database");

const addTraitToDeck = (
    userId,
    deckId,
    traitId,
    intensity,
    callback
) => {
    if (intensity < 1 || intensity > 7) {
        return callback({
            code: "INVALID_INTENSITY"
        });
    }

    const deckSql = `
        SELECT id_decks
        FROM decks
        WHERE id_decks = ?
        AND user_id = ?
    `;

    connection.query(deckSql, [deckId, userId], (error, results) => {
        if (error) {
            return callback(error);
        }

        if (results.length === 0) {
            return callback({
                code: "DECK_NOT_ALLOWED"
            });
        }

        const traitSql = `
            SELECT id_traits
            FROM traits
            WHERE id_traits = ?
        `;

        connection.query(traitSql, [traitId], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length === 0) {
                return callback({
                    code: "TRAIT_NOT_FOUND"
                });
            }

            const countSql = `
                SELECT
                    COUNT(*) AS traitCount,
                    COALESCE(SUM(intensity), 0) AS totalIntensity
                FROM deck_traits
                WHERE deck_id = ?
            `;

            connection.query(countSql, [deckId], (error, results) => {
                if (error) {
                    return callback(error);
                }

const traitCount = Number(results[0].traitCount);
const totalIntensity = Number(results[0].totalIntensity);

                if (traitCount >= 3) {
                    return callback({
                        code: "TRAITS_FULL"
                    });
                }

                if (totalIntensity + intensity > 9) {
                    return callback({
                        code: "INTENSITY_LIMIT"
                    });
                }

                const insertSql = `
                    INSERT INTO deck_traits (
                        deck_id,
                        trait_id,
                        intensity
                    )
                    VALUES (?, ?, ?)
                `;

                connection.query(
                    insertSql,
                    [deckId, traitId, intensity],
                    (error, result) => {
                        if (error) {
                            if (error.code === "ER_DUP_ENTRY") {
                                return callback({
                                    code: "TRAIT_ALREADY_EXISTS"
                                });
                            }

                            return callback(error);
                        }

                        callback(null, {
                            id_deck_traits: result.insertId,
                            deck_id: deckId,
                            trait_id: traitId,
                            intensity
                        });
                    }
                );
            });
        });
    });
};

module.exports = {
    addTraitToDeck
};