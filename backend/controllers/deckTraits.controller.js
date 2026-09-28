const deckTraitsService = require("../services/deckTraits.service");

const addTraitToDeck = (req, res) => {
    const userId = req.user.id_users;
    const deckId = req.params.deckId;

    const {
        trait_id,
        intensity
    } = req.body;

    if (
        trait_id === undefined ||
        intensity === undefined
    ) {
        return res.status(400).json({
            error: "Le trait et son intensité sont obligatoires"
        });
    }

    deckTraitsService.addTraitToDeck(
        userId,
        deckId,
        trait_id,
        intensity,
        (error, deckTrait) => {
            if (error) {
                console.error(
                    "Erreur lors de l'ajout du trait :",
                    error.message || error.code
                );

                if (error.code === "INVALID_INTENSITY") {
                    return res.status(400).json({
                        error: "L'intensité doit être comprise entre 1 et 7"
                    });
                }

                if (error.code === "DECK_NOT_ALLOWED") {
                    return res.status(403).json({
                        error: "Vous n'avez pas accès à ce deck"
                    });
                }

                if (error.code === "TRAIT_NOT_FOUND") {
                    return res.status(404).json({
                        error: "Trait introuvable"
                    });
                }

                if (error.code === "TRAITS_FULL") {
                    return res.status(409).json({
                        error: "Le deck possède déjà 3 traits"
                    });
                }

                if (error.code === "INTENSITY_LIMIT") {
                    return res.status(409).json({
                        error: "Le total des intensités ne peut pas dépasser 9"
                    });
                }

                if (error.code === "TRAIT_ALREADY_EXISTS") {
                    return res.status(409).json({
                        error: "Ce trait est déjà présent dans le deck"
                    });
                }

                return res.status(500).json({
                    error: "Erreur lors de l'ajout du trait"
                });
            }

            res.status(201).json(deckTrait);
        }
    );
};

module.exports = {
    addTraitToDeck
};