const express = require("express");

const traitsController = require("../controllers/traits.controller");

const router = express.Router();

router.get(
    "/",
    traitsController.getTraits
);

module.exports = router;