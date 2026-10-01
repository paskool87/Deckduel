const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "DeckDuel API",
        version: "1.0.0",
        description: "Documentation de l'API backend du projet DeckDuel"
    },

    servers: [
        {
            url: "http://localhost:3000",
            description: "Serveur local"
        }
    ],

    tags: [
        {
            name: "API",
            description: "Routes générales de l'API"
        },
        {
            name: "Authentification",
            description: "Gestion de l'authentification"
        },
        {
            name: "Utilisateurs",
            description: "Gestion des utilisateurs"
        },
        {
            name: "Decks",
            description: "Gestion des decks"
        },
        {
            name: "Cartes",
            description: "Gestion des cartes"
        },
        {
            name: "Traits",
            description: "Gestion des traits des decks"
        },
        {
            name: "Capacités spéciales",
            description: "Liste des capacités spéciales disponibles"
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },

        schemas: {
            Error: {
                type: "object",
                properties: {
                    error: {
                        type: "string"
                    }
                }
            },

            User: {
                type: "object",
                properties: {
                    id_users: {
                        type: "integer",
                        example: 1
                    },
                    username: {
                        type: "string",
                        example: "Pascal"
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "pascal@test.fr"
                    }
                }
            },

            LoginResponse: {
                type: "object",
                properties: {
                    user: {
                        $ref: "#/components/schemas/User"
                    },
                    token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIs..."
                    }
                }
            },

            Deck: {
                type: "object",
                properties: {
                    id_decks: {
                        type: "integer",
                        example: 2
                    },
                    user_id: {
                        type: "integer",
                        example: 1
                    },
                    name: {
                        type: "string",
                        example: "Mon deck"
                    },
                    created_at: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-25T10:00:00.000Z"
                    }
                }
            },

            Card: {
                type: "object",
                properties: {
                    id_cards: {
                        type: "integer",
                        example: 10
                    },
                    deck_id: {
                        type: "integer",
                        example: 2
                    },
                    health: {
                        type: "integer",
                        minimum: 10,
                        example: 50
                    },
                    attack: {
                        type: "integer",
                        minimum: 0,
                        example: 30
                    },
                    defense: {
                        type: "integer",
                        minimum: 0,
                        example: 20
                    },
                    special_ability_id: {
                        type: "integer",
                        nullable: true,
                        example: 4
                    }
                }
            },

            Trait: {
                type: "object",
                properties: {
                    id_deck_traits: {
                        type: "integer",
                        example: 1
                    },
                    deck_id: {
                        type: "integer",
                        example: 2
                    },
                    trait_id: {
                        type: "integer",
                        example: 1
                    },
                    intensity: {
                        type: "integer",
                        minimum: 1,
                        maximum: 7,
                        example: 5
                    }
                }
            },

            SpecialAbility: {
                type: "object",
                properties: {
                    id_special_abilities: {
                        type: "integer",
                        example: 1
                    },
                    name: {
                        type: "string",
                        example: "Régénération"
                    },
                    description: {
                        type: "string",
                        example: "Récupère des points de vie pendant le combat"
                    }
                }
            }
        }
    },

    paths: {
        "/api": {
            get: {
                tags: ["API"],
                summary: "Vérifier que l'API fonctionne",
                responses: {
                    200: {
                        description: "API opérationnelle",
                        content: {
                            "application/json": {
                                example: {
                                    message: "API DeckDuel opérationnelle"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/health": {
            get: {
                tags: ["API"],
                summary: "Vérifier l'état du serveur",
                responses: {
                    200: {
                        description: "Serveur opérationnel",
                        content: {
                            "application/json": {
                                example: {
                                    status: "OK"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/auth/login": {
            post: {
                tags: ["Authentification"],
                summary: "Authentifier un utilisateur",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                email: "pascal@test.fr",
                                password: "motdepasse"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Authentification réussie",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/LoginResponse"
                                },
                                example: {
                                    user: {
                                        id_users: 1,
                                        username: "Pascal",
                                        email: "pascal@test.fr"
                                    },
                                    token: "eyJhbGciOiJIUzI1NiIs..."
                                }
                            }
                        }
                    },

                    400: {
                        description: "Données manquantes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "L'email et le mot de passe sont obligatoires"
                                }
                            }
                        }
                    },

                    401: {
                        description: "Identifiants incorrects",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Email ou mot de passe incorrect"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la connexion"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/users": {
            get: {
                tags: ["Utilisateurs"],
                summary: "Récupérer les utilisateurs",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Liste des utilisateurs",
                        content: {
                            "application/json": {
                                example: [
                                    {
                                        id_users: 1,
                                        username: "Pascal",
                                        email: "pascal@test.fr"
                                    }
                                ]
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la récupération des utilisateurs"
                                }
                            }
                        }
                    }
                }
            },

            post: {
                tags: ["Utilisateurs"],
                summary: "Créer un utilisateur",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                username: "Pascal",
                                email: "pascal@test.fr",
                                password: "motdepasse"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Utilisateur créé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User"
                                },
                                example: {
                                    id_users: 1,
                                    username: "Pascal",
                                    email: "pascal@test.fr"
                                }
                            }
                        }
                    },

                    400: {
                        description: "Données manquantes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Le nom d'utilisateur, l'email et le mot de passe sont obligatoires"
                                }
                            }
                        }
                    },

                    409: {
                        description: "Adresse email déjà utilisée",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Cette adresse email est déjà utilisée"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la création de l'utilisateur"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/users/me": {
            get: {
                tags: ["Utilisateurs"],
                summary: "Récupérer l'utilisateur authentifié",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Utilisateur authentifié",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Utilisateur authentifié",
                                    user: {
                                        id_users: 1
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        description: "Token absent ou invalide",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    missing: {
                                        value: {
                                            error: "Token d'authentification manquant"
                                        }
                                    },
                                    invalid: {
                                        value: {
                                            error: "Token d'authentification invalide ou expiré"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/decks": {
            get: {
                tags: ["Decks"],
                summary: "Récupérer les decks de l'utilisateur",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Liste des decks",
                        content: {
                            "application/json": {
                                example: [
                                    {
                                        id_decks: 2,
                                        user_id: 1,
                                        name: "Deck de test",
                                        created_at: "2026-09-25T10:00:00.000Z"
                                    }
                                ]
                            }
                        }
                    },

                    401: {
                        description: "Authentification requise",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la récupération des decks"
                                }
                            }
                        }
                    }
                }
            },

            post: {
                tags: ["Decks"],
                summary: "Créer un deck",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            example: {
                                name: "Mon deck"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Deck créé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Deck"
                                },
                                example: {
                                    id_decks: 2,
                                    user_id: 1,
                                    name: "Mon deck"
                                }
                            }
                        }
                    },

                    401: {
                        description: "Authentification requise",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    },

                    409: {
                        description: "L'utilisateur possède déjà un deck",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "L'utilisateur possède déjà un deck"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la création du deck"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/decks/{deckId}": {
            get: {
                tags: ["Decks"],
                summary: "Récupérer un deck avec ses cartes et ses traits",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    }
                ],

                responses: {
                    200: {
                        description: "Deck récupéré",
                        content: {
                            "application/json": {
                                example: {
                                    id_decks: 2,
                                    user_id: 1,
                                    name: "Deck de test",
                                    created_at: "2026-09-25T10:00:00.000Z",
                                    cards: [
                                        {
                                            id_cards: 10,
                                            deck_id: 2,
                                            health: 50,
                                            attack: 30,
                                            defense: 20,
                                            special_ability_id: 4
                                        }
                                    ],
                                    traits: [
                                        {
                                            trait_id: 1,
                                            name: "Force",
                                            description: "Augmente la puissance des attaques",
                                            intensity: 5
                                        }
                                    ]
                                }
                            }
                        }
                    },

                    401: {
                        description: "Authentification requise"
                    },

                    404: {
                        description: "Deck introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Deck introuvable"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la récupération du deck"
                                }
                            }
                        }
                    }
                }
            },

            put: {
                tags: ["Decks"],
                summary: "Modifier un deck",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                name: "Mon nouveau deck"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Deck modifié",
                        content: {
                            "application/json": {
                                example: {
                                    id_decks: 2,
                                    user_id: 1,
                                    name: "Mon nouveau deck"
                                }
                            }
                        }
                    },

                    400: {
                        description: "Nom du deck manquant",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Le nom du deck est obligatoire"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Deck introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Deck introuvable"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la modification du deck"
                                }
                            }
                        }
                    }
                }
            },

            delete: {
                tags: ["Decks"],
                summary: "Supprimer un deck",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    }
                ],

                responses: {
                    204: {
                        description: "Deck supprimé"
                    },

                    404: {
                        description: "Deck introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Deck introuvable"
                                }
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la suppression du deck"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/decks/{deckId}/cards": {
            post: {
                tags: ["Cartes"],
                summary: "Ajouter une carte à un deck",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                health: 50,
                                attack: 30,
                                defense: 20,
                                special_ability_id: 4
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Carte créée",
                        content: {
                            "application/json": {
                                example: {
                                    id_cards: 10,
                                    deck_id: 2,
                                    health: 50,
                                    attack: 30,
                                    defense: 20,
                                    special_ability_id: 4
                                }
                            }
                        }
                    },

                    400: {
                        description: "Données de carte invalides",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    required: {
                                        value: {
                                            error: "Les caractéristiques de la carte sont obligatoires"
                                        }
                                    },
                                    health: {
                                        value: {
                                            error: "La santé de la carte doit être d'au moins 10"
                                        }
                                    },
                                    stats: {
                                        value: {
                                            error: "L'attaque et la défense doivent être positives ou nulles"
                                        }
                                    },
                                    total: {
                                        value: {
                                            error: "La somme de la santé, de l'attaque et de la défense doit être égale à 100"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    403: {
                        description: "Accès au deck refusé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Vous n'avez pas accès à ce deck"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Deck ou capacité spéciale introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    deck: {
                                        value: {
                                            error: "Deck introuvable"
                                        }
                                    },
                                    ability: {
                                        value: {
                                            error: "Capacité spéciale introuvable"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    409: {
                        description: "Limite du deck ou doublon",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    cards: {
                                        value: {
                                            error: "Le deck contient déjà 20 cartes"
                                        }
                                    },
                                    specialCards: {
                                        value: {
                                            error: "Le deck contient déjà 5 cartes avec une capacité spéciale"
                                        }
                                    },
                                    duplicate: {
                                        value: {
                                            error: "Cette capacité spéciale est déjà utilisée dans le deck"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/decks/{deckId}/cards/{cardId}": {
            put: {
                tags: ["Cartes"],
                summary: "Modifier une carte",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    },
                    {
                        name: "cardId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 10
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                health: 40,
                                attack: 35,
                                defense: 25,
                                special_ability_id: null
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Carte modifiée",
                        content: {
                            "application/json": {
                                example: {
                                    id_cards: 10,
                                    deck_id: 2,
                                    health: 40,
                                    attack: 35,
                                    defense: 25,
                                    special_ability_id: null
                                }
                            }
                        }
                    },

                    400: {
                        description: "Données de carte invalides",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    required: {
                                        value: {
                                            error: "Les caractéristiques de la carte sont obligatoires"
                                        }
                                    },
                                    health: {
                                        value: {
                                            error: "La santé de la carte doit être d'au moins 10"
                                        }
                                    },
                                    stats: {
                                        value: {
                                            error: "L'attaque et la défense doivent être positives ou nulles"
                                        }
                                    },
                                    total: {
                                        value: {
                                            error: "La somme de la santé, de l'attaque et de la défense doit être égale à 100"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    403: {
                        description: "Accès au deck refusé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Vous n'avez pas accès à ce deck"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Carte ou capacité spéciale introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    card: {
                                        value: {
                                            error: "Carte introuvable"
                                        }
                                    },
                                    ability: {
                                        value: {
                                            error: "Capacité spéciale introuvable"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    409: {
                        description: "Conflit de capacité spéciale",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    duplicate: {
                                        value: {
                                            error: "Cette capacité spéciale est déjà utilisée dans le deck"
                                        }
                                    },
                                    limit: {
                                        value: {
                                            error: "Le deck contient déjà 5 cartes avec une capacité spéciale"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            delete: {
                tags: ["Cartes"],
                summary: "Supprimer une carte",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    },
                    {
                        name: "cardId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 10
                    }
                ],

                responses: {
                    204: {
                        description: "Carte supprimée"
                    },

                    403: {
                        description: "Accès au deck refusé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Vous n'avez pas accès à ce deck"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Carte introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Carte introuvable"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/decks/{deckId}/traits": {
            post: {
                tags: ["Traits"],
                summary: "Ajouter un trait à un deck",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                trait_id: 1,
                                intensity: 5
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Trait ajouté",
                        content: {
                            "application/json": {
                                example: {
                                    id_deck_traits: 1,
                                    deck_id: 2,
                                    trait_id: 1,
                                    intensity: 5
                                }
                            }
                        }
                    },

                    400: {
                        description: "Intensité invalide ou données manquantes",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    required: {
                                        value: {
                                            error: "Le trait et son intensité sont obligatoires"
                                        }
                                    },
                                    intensity: {
                                        value: {
                                            error: "L'intensité doit être comprise entre 1 et 7"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    403: {
                        description: "Accès au deck refusé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Vous n'avez pas accès à ce deck"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Trait introuvable",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Trait introuvable"
                                }
                            }
                        }
                    },

                    409: {
                        description: "Limite ou doublon",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    full: {
                                        value: {
                                            error: "Le deck possède déjà 3 traits"
                                        }
                                    },
                                    intensity: {
                                        value: {
                                            error: "Le total des intensités ne peut pas dépasser 9"
                                        }
                                    },
                                    duplicate: {
                                        value: {
                                            error: "Ce trait est déjà présent dans le deck"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/decks/{deckId}/traits/{traitId}": {
            put: {
                tags: ["Traits"],
                summary: "Modifier l'intensité d'un trait",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    },
                    {
                        name: "traitId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 1
                    }
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                intensity: 4
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Trait modifié",
                        content: {
                            "application/json": {
                                example: {
                                    id_deck_traits: 1,
                                    deck_id: 2,
                                    trait_id: 1,
                                    intensity: 4
                                }
                            }
                        }
                    },

                    400: {
                        description: "Intensité invalide ou manquante",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                examples: {
                                    required: {
                                        value: {
                                            error: "L'intensité est obligatoire"
                                        }
                                    },
                                    invalid: {
                                        value: {
                                            error: "L'intensité doit être comprise entre 1 et 7"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    403: {
                        description: "Accès au deck refusé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Vous n'avez pas accès à ce deck"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Trait introuvable dans le deck",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Trait introuvable dans ce deck"
                                }
                            }
                        }
                    },

                    409: {
                        description: "Limite d'intensité dépassée",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Le total des intensités ne peut pas dépasser 9"
                                }
                            }
                        }
                    }
                }
            },

            delete: {
                tags: ["Traits"],
                summary: "Supprimer un trait d'un deck",
                security: [
                    {
                        bearerAuth: []
                    }
                ],

                parameters: [
                    {
                        name: "deckId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 2
                    },
                    {
                        name: "traitId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        },
                        example: 1
                    }
                ],

                responses: {
                    204: {
                        description: "Trait supprimé"
                    },

                    403: {
                        description: "Accès au deck refusé",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Vous n'avez pas accès à ce deck"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Trait introuvable dans le deck",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Trait introuvable dans ce deck"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/special-abilities": {
            get: {
                tags: ["Capacités spéciales"],
                summary: "Lister les capacités spéciales disponibles",

                responses: {
                    200: {
                        description: "Liste des capacités spéciales",
                        content: {
                            "application/json": {
                                example: [
                                    {
                                        id_special_abilities: 1,
                                        name: "Régénération",
                                        description: "Récupère des points de vie pendant le combat"
                                    },
                                    {
                                        id_special_abilities: 2,
                                        name: "Double attaque",
                                        description: "Effectue deux attaques normales pendant le duel de la carte"
                                    },
                                    {
                                        id_special_abilities: 3,
                                        name: "Vol de vie",
                                        description: "Pendant les trois duels suivants, ajoute 2 PV à notre camp et retire 2 PV au camp adverse"
                                    }
                                ]
                            }
                        }
                    },

                    500: {
                        description: "Erreur serveur",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                },
                                example: {
                                    error: "Erreur lors de la récupération des capacités spéciales"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = {
    swaggerUi,
    swaggerDocument
};