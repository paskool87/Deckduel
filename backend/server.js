require("dotenv").config();

const express = require("express");
const connection = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api", (req, res) => {
    res.json({
        message: "API DeckDuel opérationnelle"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

app.get("/api/users", (req, res) => {
    connection.query("SELECT * FROM users", (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error.message);

            return res.status(500).json({
                error: "Erreur lors de la récupération des utilisateurs"
            });
        }

        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Serveur DeckDuel démarré sur le port ${PORT}`);
});