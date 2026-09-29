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
                    const specialAbilityExistsSql = `
                        SELECT id_special_abilities
                        FROM special_abilities
                        WHERE id_special_abilities = ?
                    `;

                    connection.query(
                        specialAbilityExistsSql,
                        [specialAbilityId],
                        (error, results) => {
                            if (error) {
                                return callback(error);
                            }

                            if (results.length === 0) {
                                return callback({
                                    code: "SPECIAL_ABILITY_NOT_FOUND"
                                });
                            }

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
                        }
                    );
                } else {
                    checkCardLimits();
                }
            }
        );
    });
};

const updateCard = (
    userId,
    deckId,
    cardId,
    health,
    attack,
    defense,
    specialAbilityId,
    callback
) => {
    const deckSql = `
        SELECT id_decks
        FROM decks
        WHERE id_decks = ?
        AND user_id = ?
    `;

    connection.query(
        deckSql,
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

            const cardSql = `
                SELECT id_cards
                FROM cards
                WHERE id_cards = ?
                AND deck_id = ?
            `;

            connection.query(
                cardSql,
                [cardId, deckId],
                (error, results) => {
                    if (error) {
                        return callback(error);
                    }

                    if (results.length === 0) {
                        return callback({
                            code: "CARD_NOT_FOUND"
                        });
                    }

                    const update = () => {
                        const sql = `
                            UPDATE cards
                            SET
                                health = ?,
                                attack = ?,
                                defense = ?,
                                special_ability_id = ?
                            WHERE id_cards = ?
                            AND deck_id = ?
                        `;

                        connection.query(
                            sql,
                            [
                                health,
                                attack,
                                defense,
                                specialAbilityId,
                                cardId,
                                deckId
                            ],
                            (error) => {
                                if (error) {
                                    return callback(error);
                                }

                                callback(null, {
                                    id_cards: cardId,
                                    deck_id: deckId,
                                    health,
                                    attack,
                                    defense,
                                    special_ability_id:
                                        specialAbilityId
                                });
                            }
                        );
                    };

                    if (specialAbilityId !== null) {
                        const abilitySql = `
                            SELECT id_special_abilities
                            FROM special_abilities
                            WHERE id_special_abilities = ?
                        `;

                        connection.query(
                            abilitySql,
                            [specialAbilityId],
                            (error, results) => {
                                if (error) {
                                    return callback(error);
                                }

                                if (results.length === 0) {
                                    return callback({
                                        code: "SPECIAL_ABILITY_NOT_FOUND"
                                    });
                                }

                                const duplicateSql = `
                                    SELECT id_cards
                                    FROM cards
                                    WHERE deck_id = ?
                                    AND special_ability_id = ?
                                    AND id_cards != ?
                                `;

                                connection.query(
                                    duplicateSql,
                                    [
                                        deckId,
                                        specialAbilityId,
                                        cardId
                                    ],
                                    (error, results) => {
                                        if (error) {
                                            return callback(error);
                                        }

                                        if (results.length > 0) {
                                            return callback({
                                                code: "SPECIAL_ABILITY_ALREADY_USED"
                                            });
                                        }

                                        update();
                                    }
                                );
                            }
                        );
                    } else {
                        update();
                    }
                }
            );
        }
    );
};

const deleteCard = (
    userId,
    deckId,
    cardId,
    callback
) => {
    const deckSql = `
        SELECT id_decks
        FROM decks
        WHERE id_decks = ?
        AND user_id = ?
    `;

    connection.query(
        deckSql,
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

            const cardSql = `
                SELECT id_cards
                FROM cards
                WHERE id_cards = ?
                AND deck_id = ?
            `;

            connection.query(
                cardSql,
                [cardId, deckId],
                (error, results) => {
                    if (error) {
                        return callback(error);
                    }

                    if (results.length === 0) {
                        return callback({
                            code: "CARD_NOT_FOUND"
                        });
                    }

                    const deleteSql = `
                        DELETE FROM cards
                        WHERE id_cards = ?
                        AND deck_id = ?
                    `;

                    connection.query(
                        deleteSql,
                        [cardId, deckId],
                        (error) => {
                            if (error) {
                                return callback(error);
                            }

                            callback(null);
                        }
                    );
                }
            );
        }
    );
};

module.exports = {
    createCard,
    updateCard,
    deleteCard
};