# MLD — Ciné Délices

## UTILISATEUR
- id_utilisateur (PK)
- pseudo
- email
- mot_de_passe
- date_inscription

---

## CATEGORIE
- id_categorie (PK)
- nom
- description

---

## FILM_SERIE
- id_film_serie (PK)
- titre
- type
- genre
- annee_sortie
- synopsis
- image_url

---

## RECETTE
- id_recette (PK)
- titre
- description
- ingredients
- etapes
- image_url
- date_creation
- id_utilisateur (FK)
- id_categorie (FK)

---

## RECETTE_FILM_SERIE
- id_recette (PK, FK)
- id_film_serie (PK, FK)

---

## FAVORI
- id_utilisateur (PK, FK)
- id_recette (PK, FK)
- date_ajout

---

## COMMENTAIRE
- id_commentaire (PK)
- contenu
- note
- date_commentaire
- id_utilisateur (FK)
- id_recette (FK)

![shéma du mld](MLD_cinedelice.pdf)