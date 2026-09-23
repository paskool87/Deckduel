const express = require("express");

const app = express();

const PORT = 3000;

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

app.listen(PORT, () => {
    console.log(`Serveur DeckDuel démarré sur le port ${PORT}`);
});