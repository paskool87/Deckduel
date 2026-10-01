# DeckDuel

Projet de jeu de cartes réalisé dans le cadre du titre professionnel Développeur Web et Web Mobile.

## Présentation

DeckDuel est une application web de jeu de cartes basée sur des affrontements entre personnages.

Le projet est composé d'un frontend permettant à l'utilisateur de gérer son deck et d'un backend fournissant une API REST pour gérer les données et la logique métier.

## Structure

* `frontend` : application cliente
* `backend` : API REST et logique métier

## Technologies utilisées

### Frontend

* JavaScript
* Vite
* JSX
* SCSS

### Backend

* Node.js
* Express
* JavaScript
* MySQL
* mysql2
* bcrypt
* JSON Web Token (JWT)
* Swagger

### Outils

* Visual Studio Code
* Postman
* MySQL Workbench
* Git
* GitHub

## Backend

Le backend fournit une API REST permettant notamment de gérer :

* les utilisateurs
* l'authentification
* les decks
* les cartes
* les traits
* les capacités spéciales

L'API utilise une organisation en plusieurs couches :

* `routes` : définition des endpoints
* `controllers` : gestion des requêtes et réponses HTTP
* `services` : logique métier et accès aux données
* `middlewares` : gestion de l'authentification
* `database` : scripts liés à la base de données

## Documentation de l'API

La documentation interactive de l'API est disponible avec Swagger.

Après démarrage du backend :

`http://localhost:3000/api-docs`
