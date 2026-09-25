const authService = require("../services/auth.service");

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "L'email et le mot de passe sont obligatoires"
        });
    }

    authService.login(email, password, (error, user) => {
        if (error) {
            console.error("Erreur lors de la connexion :", error.message);

            return res.status(500).json({
                error: "Erreur lors de la connexion"
            });
        }

        if (!user) {
            return res.status(401).json({
                error: "Email ou mot de passe incorrect"
            });
        }

        res.json(user);
    });
};

module.exports = {
    login
};