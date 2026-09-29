const cardsService = require("../services/cards.service");

const createCard = (req, res) => {
    const userId = req.user.id_users;
    const deckId = req.params.deckId;

    const {
        health,
        attack,
        defense,
        special_ability_id
    } = req.body;

    if (
        health === undefined ||
        attack === undefined ||
        defense === undefined
    ) {
        return res.status(400).json({
            error: "Les caractéristiques de la carte sont obligatoires"
        });
    }

    const specialAbilityId =
        special_ability_id === undefined
            ? null
            : special_ability_id;

    cardsService.createCard(
        userId,
        deckId,
        health,
        attack,
        defense,
        specialAbilityId,
        (error, card) => {
            if (error) {
                console.error(
                    "Erreur lors de la création de la carte :",
                    error.message || error.code
                );

                if (error.code === "DECK_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Deck introuvable"
                    });
                }

                if (error.code === "DECK_NOT_ALLOWED") {
                    return res.status(403).json({
                        error: "Vous n'avez pas accès à ce deck"
                    });
                }

                if (error.code === "DECK_FULL") {
                    return res.status(409).json({
                        error: "Le deck contient déjà 20 cartes"
                    });
                }

                if (error.code === "SPECIAL_CARDS_FULL") {
                    return res.status(409).json({
                        error: "Le deck contient déjà 5 cartes avec une capacité spéciale"
                    });
                }

                if (error.code === "SPECIAL_ABILITY_ALREADY_USED") {
                    return res.status(409).json({
                        error: "Cette capacité spéciale est déjà utilisée dans le deck"
                    });
                }

                if (error.code === "SPECIAL_ABILITY_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Capacité spéciale introuvable"
                    });
                }

                return res.status(500).json({
                    error: "Erreur lors de la création de la carte"
                });
            }

            res.status(201).json(card);
        }
    );
};

const updateCard = (req, res) => {
    const userId = req.user.id_users;
    const deckId = req.params.deckId;
    const cardId = req.params.cardId;

    const {
        health,
        attack,
        defense,
        special_ability_id
    } = req.body;

    if (
        health === undefined ||
        attack === undefined ||
        defense === undefined
    ) {
        return res.status(400).json({
            error: "Les caractéristiques de la carte sont obligatoires"
        });
    }

    const specialAbilityId =
        special_ability_id === undefined
            ? null
            : special_ability_id;

    cardsService.updateCard(
        userId,
        deckId,
        cardId,
        health,
        attack,
        defense,
        specialAbilityId,
        (error, card) => {
            if (error) {
                console.error(
                    "Erreur lors de la modification de la carte :",
                    error.message || error.code
                );

                if (error.code === "DECK_NOT_ALLOWED") {
                    return res.status(403).json({
                        error: "Vous n'avez pas accès à ce deck"
                    });
                }

                if (error.code === "CARD_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Carte introuvable"
                    });
                }

                if (error.code === "SPECIAL_ABILITY_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Capacité spéciale introuvable"
                    });
                }

                if (error.code === "SPECIAL_ABILITY_ALREADY_USED") {
                    return res.status(409).json({
                        error: "Cette capacité spéciale est déjà utilisée dans le deck"
                    });
                }

                return res.status(500).json({
                    error: "Erreur lors de la modification de la carte"
                });
            }

            res.json(card);
        }
    );
};

const deleteCard = (req, res) => {
    const userId = req.user.id_users;
    const deckId = req.params.deckId;
    const cardId = req.params.cardId;

    cardsService.deleteCard(
        userId,
        deckId,
        cardId,
        (error) => {
            if (error) {
                console.error(
                    "Erreur lors de la suppression de la carte :",
                    error.message || error.code
                );

                if (error.code === "DECK_NOT_ALLOWED") {
                    return res.status(403).json({
                        error: "Vous n'avez pas accès à ce deck"
                    });
                }

                if (error.code === "CARD_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Carte introuvable"
                    });
                }

                return res.status(500).json({
                    error: "Erreur lors de la suppression de la carte"
                });
            }

            res.status(204).send();
        }
    );
};

module.exports = {
    createCard,
    updateCard,
    deleteCard
};