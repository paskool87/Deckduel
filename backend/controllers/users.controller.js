const usersService = require("../services/users.service");

const getUsers = (req, res) => {
    usersService.getUsers((error, users) => {
        if (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error.message);

            return res.status(500).json({
                error: "Erreur lors de la récupération des utilisateurs"
            });
        }

        res.json(users);
    });
};

module.exports = {
    getUsers
};