const decksService = require("../services/decks.service");

const getDecks = (req, res) => {
  const userId = req.user.id_users;

  decksService.getDecks(userId, (error, decks) => {
    if (error) {
      console.error(
        "Erreur lors de la récupération des decks :",
        error.message,
      );

      return res.status(500).json({
        error: "Erreur lors de la récupération des decks",
      });
    }

    res.json(decks);
  });
};

const createDeck = (req, res) => {
  const userId = req.user.id_users;
  const { name } = req.body;

  const deckName = name || "Deck sans nom";

  decksService.createDeck(userId, deckName, (error, deck) => {
    if (error) {
      console.error(
        "Erreur lors de la création du deck :",
        error.message || error.code,
      );

      if (error.code === "DECK_ALREADY_EXISTS") {
        return res.status(409).json({
          error: "L'utilisateur possède déjà un deck",
        });
      }

      return res.status(500).json({
        error: "Erreur lors de la création du deck",
      });
    }

    res.status(201).json(deck);
  });
};

const getDeckById = (req, res) => {
    const userId = req.user.id_users;
    const deckId = req.params.deckId;

    decksService.getDeckById(
        userId,
        deckId,
        (error, deck) => {
            if (error) {
                console.error(
                    "Erreur lors de la récupération du deck :",
                    error.message || error.code
                );

                if (error.code === "DECK_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Deck introuvable"
                    });
                }

                return res.status(500).json({
                    error: "Erreur lors de la récupération du deck"
                });
            }

            res.json(deck);
        }
    );
};

module.exports = {
  getDecks,
  createDeck,
  getDeckById
};
