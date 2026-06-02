# 🌿 Guide Git — Bonne conduite pour l'équipe

## Règle d'or

> **On ne travaille JAMAIS directement sur `main` ou `develop`.**
> Chaque développeur crée sa propre branche à partir de `develop`.

---

## 1. Avant de commencer à coder

```bash
# 1. Se placer sur develop
git checkout develop

# 2. Récupérer les dernières mises à jour
git pull origin develop

# 3. Créer sa propre branche
git checkout -b prenom/nom-de-la-feature

# Exemple :
git checkout -b jordan/ajout-footer
```

---

## 2. Pendant le développement

```bash
# Vérifier l'état de ses fichiers
git status

# Ajouter ses modifications
git add .

# Faire un commit clair et descriptif
git commit -m "feat: description courte de ce que tu as fait"

# Envoyer sa branche sur GitHub
git push origin prenom/nom-de-la-feature
```

---

## 3. Quand la feature est terminée — Créer une Pull Request

1. Aller sur **GitHub** → onglet **"Pull requests"**
2. Cliquer sur **"New pull request"**
3. Vérifier **IMPÉRATIVEMENT** les branches :
   - **base** → `develop` ✅ (pas `main` ❌)
   - **compare** → ta branche
4. Cliquer **"Create pull request"**
5. Demander une review à un collègue si besoin
6. Une fois validée → **"Merge pull request"**

---

## 4. Après le merge — Mettre à jour son local

```bash
git checkout develop
git pull origin develop
```

---

## ⚠️ Les erreurs à ne PAS faire

| ❌ Interdit | ✅ À faire à la place |
|------------|----------------------|
| Travailler sur `main` | Travailler sur sa propre branche |
| Travailler sur `develop` | Travailler sur sa propre branche |
| Faire une PR vers `main` | Faire une PR vers `develop` |
| Commiter sans message clair | Écrire un message descriptif |
| Ne pas pull avant de commencer | Toujours `git pull origin develop` en premier |

---

## 🔁 Résumé du flux

```
main
 └── develop
      └── prenom/ma-feature  ← tu travailles ici
           └── PR vers develop (pas main !)
```
