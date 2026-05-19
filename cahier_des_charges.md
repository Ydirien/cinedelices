# Cahier des charges

## La présentation du projet ✅

## La définition des besoins (problèmes auxquels répond le projet) et des objectifs (solutions qu'apporte le projet) du projet
 - Les fonctionnalités du projet (spécifications fonctionnelles)

## Le MVP (Minimum Viable Product) :
Le projet va faire l'objet de plusieurs étapes : l'idée c'est qu'à chaque étape le produit fonctionne, même si ce n'est pas avec toutes les fonctionnalités qui étaient prévues
Il faut se poser la question : pour que mon projet marche, est-ce que telle fonctionnalité doit marcher (MVP) ou être une fonctionnalité annexe ?

Les évolutions potentielles (ce qui ne sera pas terminé) : tout ce qui est prévu mais ne fait pas partie du MVP

## Le choix et la justification de l'architecture du projet (front, back, BDD) ✅


## La liste des technologies utilisées pour le projet, avec justification (spécifications techniques) ✅

## La définition de la cible du projet (le public visé) : ça permettra entre autres choses d'anticiper certaines contraintes visuelles/ergonomiques/techniques ✅

## Les navigateurs compatibles ✅

- Tout les navigateurs sont compatible avec les technologies utilisé (si dernière version)

## L'arborescence de l'application (le chemin de l'utilisateur, correspondra aux routes front)

## La liste des routes prévues (les routes front sont couvertes par l'arborescence en toute logique, restent les endpoints de votre API) ✅



## Authentification

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

---

## Recettes

```text
GET    /api/recipes
GET    /api/recipes/:id
POST   /api/recipes
PATCH  /api/recipes/:id
DELETE /api/recipes/:id
```

---

## Catégories

```text
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

---

## Utilisateurs (admin)

```text
GET    /api/users
GET    /api/users/:id
DELETE /api/users/:id
```

---

---

## Favoris

```text
GET    /api/favorites
POST   /api/favorites/:recipeId
DELETE /api/favorites/:recipeId
```

---


## La liste des User stories : micro scénarios “en tant que tel utilisateur, je dois pouvoir effectuer telle action afin de...” (chaque action sera redécoupée en différentes fonctionnalités) ✅




## Analyse des risques : quels sont les risques qui peuvent survenir pendant le développement et mesures pour s'en prémunir ✅


## La liste des rôles de chacun 
Documents de conception

## Le MCD / MLD et MPD (MERISE) : schéma de la base de données ✅

Un diagramme de séquence d'une fonctionnalité complexe

Les Use Cases : scénarios plus complets que les User Stories, qui décrivent les interactions entre les utilisateurs et le système

Le Dictionnaire de données : liste des entités et de leurs attributs (Fiche Récap)

BONUS : un diagramme de l'architecture de l'application (front, back, BDD, etc.)

BONUS : un diagramme d'activité d'une fonctionnalité complexe
Eléments graphiques

Wireframes ✅

Maquettes

Charte graphique

## Côté organisation


Daily obligatoire et dailies fortement conseillés !

Mise à jour (quotidienne) du suivi de vos tâches (dans le journal de bord par exemple)

Répartition claire des tâches

Identification des blocages
NB : ⚠️ seule l'équipe pédagogique peut valider vos documents. Communiquez simplement en commentaire de l'issue pour demander des vérifications ou encore poser vos interrogations !


 MVP (Minimum Viable Product)
Le MVP regroupe les fonctionnalités sans lesquelles le projet ne peut pas exister en tant que produit. Chaque étape de développement vise à livrer un produit fonctionnel, même partiel.
Catalogue de recettes

Affichage de la liste des recettes
Recherche par titre de recette ou par titre de film/série
Filtres par catégorie (entrée, plat, dessert, boisson)

Page recette

Affichage des ingrédients (sous forme de texte libre en MVP)
Affichage des instructions de préparation
Mention du film ou de la série associé(e)
Informations complémentaires (anecdote, contexte)

Système d'authentification

Inscription via formulaire
Connexion sécurisée
Gestion du profil utilisateur (consultation, modification)
Déconnexion

Ajout de recette

Formulaire d'ajout accessible uniquement aux utilisateurs authentifiés
Saisie du titre, des ingrédients, des instructions, du film/série associé, des anecdotes
Validation et publication

Back-office (administration)

Gestion des recettes (CRUD)
Gestion des catégories
Gestion des utilisateurs (rôles, suspension)
Accès restreint aux administrateurs

3.2 Évolutions potentielles (hors MVP)
Fonctionnalités envisagées pour des versions ultérieures, non garanties dans le périmètre du MVP :

Fonctionnalités sociales : commentaires (avec modération), likes, système de notation
Gestion structurée des ingrédients : passage du texte libre à une table dédiée
Filtre par ingrédient dans le catalogue
Liste de courses générée à partir d'une ou plusieurs recettes sélectionnées
Système de favoris : sauvegarde de recettes par l'utilisateur
Recommandations personnalisées basées sur les favoris, l'historique, les films préférés
Dashboard utilisateur avec statistiques personnelles
Notifications pour commentaires, likes, nouvelles recettes
Classements : recettes populaires, mieux notées, récentes
Moteur de recherche dynamique avec autocomplétion
Support multilingue français / anglais