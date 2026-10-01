-- Données de référence DeckDuel
-- Traits disponibles

INSERT INTO traits (id_traits, name, description) VALUES
(1, 'Force', 'Augmente la puissance des attaques'),
(2, 'Endurance', 'Améliore la résistance du personnage'),
(3, 'Chance', 'Améliore les probabilités liées aux effets'),
(4, 'Précision', 'Améliore la régularité des attaques'),
(5, 'Régénération', 'Améliore la récupération de points de vie'),
(6, 'Volonté', 'Réduit l''efficacité des effets négatifs subis'),
(7, 'Intelligence', 'Améliore l''efficacité des capacités spéciales'),
(8, 'Brutalité', 'Améliore les dégâts infligés lorsque l''attaque dépasse la défense');

-- Capacités spéciales disponibles

INSERT INTO special_abilities (id_special_abilities, name, description) VALUES
(1, 'Régénération', 'Récupère des points de vie pendant le combat'),
(2, 'Double attaque', 'Effectue deux attaques normales pendant le duel de la carte'),
(3, 'Vol de vie', 'Pendant les trois duels suivants, ajoute 2 PV à notre camp et retire 2 PV au camp adverse'),
(4, 'Bouclier', 'Ajoute 2 points de Défense pendant le duel de la carte'),
(5, 'Poison', 'Retire 1 PV à chaque carte adverse suivante jusqu''à la fin de la partie'),
(6, 'Surcharge', 'La carte suivante ajoute à son Attaque celle de la carte précédente'),
(7, 'Contre-attaque', 'Permet d''éviter une attaque et de contre-attaquer immédiatement en cas de réussite'),
(8, 'Absorption', 'Absorbe une partie aléatoire des dégâts reçus pendant le duel'),
(9, 'Exécution', 'Élimine l''adversaire si ses PV sont à 20 pour cent ou moins et que l''attaque inflige des dégâts'),
(10, 'Réflexion', 'Renvoie une partie aléatoire des dégâts reçus à l''adversaire'),
(11, 'Malédiction', 'Réduit de 1 la Chance du camp adverse jusqu''à la fin de la partie'),
(12, 'Coup critique', 'Utilise un random d''attaque à 100 pour cent et ajoute 1 point de bonus'),
(13, 'Combo', 'Augmente progressivement l''Attaque des cinq cartes suivantes et s''arrête si un duel est perdu'),
(14, 'Affaiblissement', 'Réduit de 2 l''Attaque adverse pendant le duel');