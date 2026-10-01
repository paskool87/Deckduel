const express = require("express");
const deckTraitsController = require("../controllers/deckTraits.controller");
const authenticateToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/decks/:deckId/traits",
    authenticateToken,
    deckTraitsController.addTraitToDeck
);

router.put(
    "/decks/:deckId/traits/:traitId",
    authenticateToken,
    deckTraitsController.updateTrait
);

router.delete(
    "/decks/:deckId/traits/:traitId",
    authenticateToken,
    deckTraitsController.deleteTrait
);

module.exports = router;