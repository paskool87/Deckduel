require("dotenv").config();

const express = require("express");
const connection = require("./database");

const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const decksRoutes = require("./routes/decks.routes");
const cardsRoutes = require("./routes/cards.routes");
const deckTraitsRoutes = require("./routes/deckTraits.routes");
const specialAbilitiesRoutes = require("./routes/specialAbilities.routes");

const { swaggerUi, swaggerDocument } = require("./swagger");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.use("/api/auth", authRoutes);
app.use("/api/decks", decksRoutes);
app.use("/api", cardsRoutes);
app.use("/api", deckTraitsRoutes);
app.use("/api/special-abilities", specialAbilitiesRoutes);

app.listen(PORT, () => {
    console.log(`Serveur DeckDuel démarré sur le port ${PORT}`);
});