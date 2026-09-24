require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((error) => {
    if (error) {
        console.error("Erreur de connexion à MySQL :", error.message);
        return;
    }

    console.log("Connexion à MySQL réussie");

    connection.query("SELECT * FROM users", (error, results) => {
        if (error) {
            console.error("Erreur SQL :", error.message);
            return;
        }

        console.log("Utilisateurs :", results);
    });
});

module.exports = connection;