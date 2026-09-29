const connection = require("../database");

const createCard = (
    userId,
    deckId,
    health,
    attack,
    defense,
    specialAbilityId,
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

                const checkCardLimits = () => {
                    const countSql = `
                        SELECT
                            COUNT(*) AS cardCount,
                            SUM(
                                CASE
                                    WHEN special_ability_id IS NOT NULL THEN 1
                                    ELSE 0
                                END
                            ) AS specialCardCount
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

                            const cardCount =
                                Number(results[0].cardCount);

                            const specialCardCount =
                                Number(results[0].specialCardCount) || 0;

                            if (cardCount >= 20) {
                                return callback({
                                    code: "DECK_FULL"
                                });
                            }

                            if (
                                specialAbilityId !== null &&
                                specialCardCount >= 5
                            ) {
                                return callback({
                                    code: "SPECIAL_CARDS_FULL"
                                });
                            }

                            const sql = `
                                INSERT INTO cards (
                                    deck_id,
                                    health,
                                    attack,
                                    defense,
                                    special_ability_id
                                )
                                VALUES (?, ?, ?, ?, ?)
                            `;

                            connection.query(
                                sql,
                                [
                                    deckId,
                                    health,
                                    attack,
                                    defense,
                                    specialAbilityId
                                ],
                                (error, result) => {
                                    if (error) {
                                        return callback(error);
                                    }

                                    callback(null, {
                                        id_cards: result.insertId,
                                        deck_id: deckId,
                                        health,
                                        attack,
                                        defense,
                                        special_ability_id:
                                            specialAbilityId
                                    });
                                }
                            );
                        }
                    );
                };

                if (specialAbilityId !== null) {
                    const specialAbilitySql = `
                        SELECT id_cards
                        FROM cards
                        WHERE deck_id = ?
                        AND special_ability_id = ?
                    `;

                    connection.query(
                        specialAbilitySql,
                        [deckId, specialAbilityId],
                        (error, results) => {
                            if (error) {
                                return callback(error);
                            }

                            if (results.length > 0) {
                                return callback({
                                    code: "SPECIAL_ABILITY_ALREADY_USED"
                                });
                            }

                            checkCardLimits();
                        }
                    );
                } else {
                    checkCardLimits();
                }
            }
        );
    });
};

module.exports = {
    createCard
};