const specialAbilitiesService = require("../services/specialAbilities.service");

const getSpecialAbilities = (req, res) => {
    specialAbilitiesService.getSpecialAbilities((error, abilities) => {
        if (error) {
            console.error(
                "Erreur lors de la récupération des capacités spéciales :",
                error.message
            );

            return res.status(500).json({
                error: "Erreur lors de la récupération des capacités spéciales"
            });
        }

        res.json(abilities);
    });
};

module.exports = {
    getSpecialAbilities
};