const express = require("express");
const specialAbilitiesController = require("../controllers/specialAbilities.controller");

const router = express.Router();

router.get("/", specialAbilitiesController.getSpecialAbilities);

module.exports = router;