# Cahier des charges

## La présentation du projet ✅

🎬 CinéDélices 🍝 

CinéDélices est une plateforme web qui propose des recettes de cuisine inspirées du cinéma, des séries et des animés. Pensée pour les amateurs de gastronomie autant que pour les cinéphiles, elle permet de redecouvrir ses films et séries préférés sous un angle inédit : celui de la table.

🎬 Le concept 💡

Derrière chaque grand film , il y a souvent un scène culinaire mémorable. CinéDélices part de cette idée pour transformer ces moments en véritables expériences gustatives : recette détaillées, anecdotes liées à l'oeuvres, et mise en lien systematique entre les plats et les films ou séries dont ils s'inspirent.

## La définition des besoins (problèmes auxquels répond le projet) et des objectifs (solutions qu'apporte le projet) du projet
 - Les fonctionnalités du projet (spécifications fonctionnelles)

## Le MVP (Minimum Viable Product) :
Le projet va faire l'objet de plusieurs étapes : l'idée c'est qu'à chaque étape le produit fonctionne, même si ce n'est pas avec toutes les fonctionnalités qui étaient prévues
Il faut se poser la question : pour que mon projet marche, est-ce que telle fonctionnalité doit marcher (MVP) ou être une fonctionnalité annexe ?

Les évolutions potentielles (ce qui ne sera pas terminé) : tout ce qui est prévu mais ne fait pas partie du MVP

## Le choix et la justification de l'architecture du projet (front, back, BDD) ✅
### Back    

back/
├── prisma/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── utils/


### Front 
 
front/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── styles/
│   │   ├── base/
│   │   ├── utils/
│   └── layouts/


## La liste des technologies utilisées pour le projet, avec justification (spécifications techniques) ✅

### Front 
- React : J’utilise React afin de créer une interface utilisateur dynamique, réutilisable et performante grâce à son architecture basée sur les composants.
- Typescript : J’utilise TypeScript plutôt que JavaScript afin d’avoir un code plus fiable, maintenable et sécurisé grâce au typage statique et à la détection d’erreurs dès le développement.
- SCSS : J’utilise SCSS afin de structurer et maintenir plus facilement mes styles grâce aux variables, aux mixins et à l’imbrication du code CSS.

### Back
-⠀Node.js : J’utilise Node.js afin de développer des applications backend rapides et scalables en JavaScript, avec une gestion efficace des opérations asynchrones et des requêtes serveur.
- typescript : IDEM
- Prisma : J’utilise Prisma plutôt que Sequelize afin de profiter d’un typage natif, d’une meilleure expérience développeur et d’une gestion des requêtes et des migrations plus moderne et intuitive.
- PostgreSQL⠀:⠀J’utilise PostgreSQL plutôt que MongoDB afin de bénéficier d’une base de données relationnelle robuste, respectant mieux la cohérence des données et offrant des requêtes SQL puissantes pour des structures complexes.
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
La définition de la cible du projet (le public visé) : ça permettra entre autres choses d'anticiper certaines contraintes visuelles/ergonomiques/techniques

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




## Analyse des risques : quels sont les risques qui peuvent survenir pendant le développement et mesures pour s'en prémunir

La liste des rôles de chacun
Documents de conception

Le MCD / MLD et MPD (MERISE) : schéma de la base de données

Un diagramme de séquence d'une fonctionnalité complexe

Les Use Cases : scénarios plus complets que les User Stories, qui décrivent les interactions entre les utilisateurs et le système

Le Dictionnaire de données : liste des entités et de leurs attributs (Fiche Récap)

BONUS : un diagramme de l'architecture de l'application (front, back, BDD, etc.)

BONUS : un diagramme d'activité d'une fonctionnalité complexe
Eléments graphiques

Wireframes

Maquettes

Charte graphique
Côté organisation

Daily obligatoire et dailies fortement conseillés !

Mise à jour (quotidienne) du suivi de vos tâches (dans le journal de bord par exemple)

Répartition claire des tâches

Identification des blocages
NB : ⚠️ seule l'équipe pédagogique peut valider vos documents. Communiquez simplement en commentaire de l'issue pour demander des vérifications ou encore poser vos interrogations !