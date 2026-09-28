const cardsService = require("../services/cards.service");

const createCard = (req, res) => {
    const userId = req.user.id_users;
    const deckId = req.params.deckId;

    const { health, attack, defense } = req.body;

    if (
        health === undefined ||
        attack === undefined ||
        defense === undefined
    ) {
        return res.status(400).json({
            error: "Les caractéristiques de la carte sont obligatoires"
        });
    }

    cardsService.createCard(
        userId,
        deckId,
        health,
        attack,
        defense,
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

                return res.status(500).json({
                    error: "Erreur lors de la création de la carte"
                });
            }

            res.status(201).json(card);
        }
    );
};

module.exports = {
    createCard
};