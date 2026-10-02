
const mysql = require("mysql2");
const fs = require("fs");

const ssl = process.env.DB_SSL_CA
    ? {
          ca: fs.readFileSync(process.env.DB_SSL_CA),
          rejectUnauthorized: true
      }
    : undefined;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl
});

connection.connect((error) => {
    if (error) {
        console.error("Erreur de connexion à MySQL :", error.message);
        return;
    }

    console.log("Connexion à MySQL réussie");
});

module.exports = connection;