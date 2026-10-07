const traitsService = require("../services/traits.service");

const getTraits = (req, res) => {
    traitsService.getTraits((error, traits) => {
        if (error) {
            console.error(
                "Erreur lors de la récupération des traits :",
                error.message
            );

            return res.status(500).json({
                error: "Erreur lors de la récupération des traits"
            });
        }

        res.json(traits);
    });
};

module.exports = {
    getTraits
};