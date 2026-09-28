const express = require("express");
const cardsController = require("../controllers/cards.controller");
const authenticateToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/decks/:deckId/cards",
    authenticateToken,
    cardsController.createCard
);

module.exports = router;