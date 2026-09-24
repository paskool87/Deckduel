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

const createUser = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
    return res.status(400).json({
        error: "Le nom d'utilisateur, l'email et le mot de passe sont obligatoires"
    });
}

    usersService.createUser(username, email, password, (error, user) => {
if (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error.message);

    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            error: "Cette adresse email est déjà utilisée"
        });
    }

    return res.status(500).json({
        error: "Erreur lors de la création de l'utilisateur"
    });
}
        res.status(201).json(user);
    });
};

module.exports = {
    getUsers,
    createUser
};