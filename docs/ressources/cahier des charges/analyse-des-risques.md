# Analyse des risques pendant le développement et mesures pour s'en prémunir

---

## 1. Incompréhension sur les besoins

**Risque :** Une mauvaise lecture du cahier des charges peut entraîner des développements inutiles ou à côté des attentes, et faire perdre du temps à toute l'équipe.

**Mesures préventives :**
- Relire et annoter le cahier des charges ensemble en début de sprint
- Rédiger des user stories claires avant de commencer à coder
- Valider les fonctionnalités avec l'équipe pédagogique en cas de doute
- Faire des démos régulières pour s'assurer qu'on développe dans le bon sens

---

## 2. Manque de commits

**Risque :** Des commits rares ou trop volumineux rendent le suivi du projet difficile, compliquent la relecture du code et augmentent les risques de conflits Git.

**Mesures préventives :**
- Adopter une convention de nommage commune (ex : Conventional Commits)
- Commiter régulièrement, idéalement après chaque fonctionnalité ou correction
- Mettre en place une règle d'équipe : pas de session de travail sans au moins un commit
- Utiliser les pull requests pour valider les ajouts avant de merger sur la branche principale

---

## 3. Manque d'organisation

**Risque :** Sans organisation claire, les tâches se chevauchent, certaines sont oubliées et la progression devient difficile à suivre.

**Mesures préventives :**
- Utiliser un outil de gestion de projet (Trello, Notion, GitHub Projects)
- Définir clairement qui fait quoi à chaque sprint
- Tenir des points d'équipe courts et réguliers (stand-up)
- Découper les tâches en sous-tâches réalistes et estimées

---

## 4. Désaccord entre l'équipe

**Risque :** Des conflits sur les choix techniques ou fonctionnels peuvent bloquer l'avancement et créer des tensions au sein du groupe.

**Mesures préventives :**
- Prendre les décisions importantes en équipe et les documenter
- En cas de désaccord, soumettre le point à l'équipe pédagogique pour arbitrage
- Favoriser une communication ouverte et bienveillante dès le début du projet
- S'appuyer sur des arguments techniques plutôt que des préférences personnelles

---

## 5. Retard sur les sprints

**Risque :** Des tâches sous-estimées ou des imprévus peuvent décaler les livraisons et mettre en danger le MVP final.

**Mesures préventives :**
- Ne pas surcharger les sprints : mieux vaut en faire moins mais bien
- Identifier les tâches critiques et les traiter en priorité
- Prévoir une marge de temps tampon dans chaque sprint
- Faire un bilan en fin de sprint pour ajuster la vélocité de l'équipe

---

## 6. Mauvaise gestion des dépendances

**Risque :** Des packages mal gérés (versions non fixées, dépendances inutiles, conflits entre librairies) peuvent provoquer des bugs difficiles à identifier.

**Mesures préventives :**
- Fixer les versions des dépendances dans `package.json` et commiter le fichier `package-lock.json`
- Discuter en équipe avant d'ajouter une nouvelle librairie
- Supprimer les dépendances non utilisées régulièrement
- Utiliser `npm audit` pour détecter les vulnérabilités connues


<!-- ## 7. Failles de sécurité

**Risque :** Une application mal sécurisée peut exposer les données des utilisateurs et compromettre l'intégrité du projet (injections SQL, XSS, tokens non protégés...).

**Mesures préventives :**
- Utiliser Prisma pour éviter les injections SQL grâce aux requêtes paramétrées
- Hasher les mots de passe avec `argon2` avant tout stockage en base
- Stocker les JWT de façon sécurisée et définir une durée d'expiration courte
- Valider et assainir toutes les données entrantes côté back (Zod)
- Mettre en place les headers de sécurité HTTP avec `helmet`
- Ne jamais exposer de variables sensibles dans le code (utiliser `.env`) -->