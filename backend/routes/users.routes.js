const express = require("express");
const usersController = require("../controllers/users.controller");
const authenticateToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/", usersController.createUser);

router.get("/me", authenticateToken, (req, res) => {
    res.json({
        message: "Utilisateur authentifié",
        user: req.user
    });
});

module.exports = router;