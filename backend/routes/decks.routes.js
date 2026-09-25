const express = require("express");
const decksController = require("../controllers/decks.controller");
const authenticateToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, decksController.getDecks);
router.post("/", authenticateToken, decksController.createDeck);

module.exports = router;