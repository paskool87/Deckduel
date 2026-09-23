const express = require("express");

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serveur DeckDuel démarré sur le port ${PORT}`);
});