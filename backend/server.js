require("dotenv").config();

const express = require("express");
const connection = require("./database");
const usersRoutes = require("./routes/users.routes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
    console.log(`Serveur DeckDuel démarré sur le port ${PORT}`);
});