import multer from "multer";
import path from "node:path";

// Taille maximale autorisée pour un fichier image uploadé
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Types MIME acceptés — correspond aux formats JPEG, PNG et WebP
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Multer est un middleware Node.js qui gère les uploads de fichiers envoyés
 * via des formulaires multipart/form-data (le seul format qui permet d'envoyer
 * des fichiers binaires dans une requête HTTP).
 *
 * Il intercept le fichier avant qu'il n'atteigne le contrôleur, le valide,
 * puis le sauvegarde sur le disque. Le contrôleur reçoit ensuite les infos
 * du fichier via req.file (un seul fichier) ou req.files (plusieurs).
 */

/**
 * Stratégie de stockage : diskStorage sauvegarde le fichier sur le disque
 * du serveur (dans le dossier "uploads/"), contrairement à memoryStorage
 * qui le garde en RAM — dangereux pour les fichiers volumineux.
 *
 * destination : dossier de destination sur le serveur
 * filename    : nom donné au fichier une fois sauvegardé
 *               → on génère un nom unique pour éviter les collisions
 *                 (deux utilisateurs qui uploadent "photo.jpg" en même temps)
 */
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
        // Suffixe unique basé sur l'horodatage + un nombre aléatoire
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // cb(erreur, nomDuFichier) — null = pas d'erreur
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

/**
 * Filtre de validation : exécuté avant le stockage.
 * Permet d'accepter ou rejeter un fichier selon son type MIME.
 *
 * Le type MIME est déclaré par le client dans les headers de la requête.
 * On vérifie qu'il correspond bien à un format image autorisé.
 *
 * cb(null, true)  → fichier accepté
 * cb(erreur)      → fichier rejeté, l'erreur remonte au gestionnaire d'erreurs Express
 */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP"));
    }
};

/**
 * Instance Multer exportée, à utiliser comme middleware dans les routes.
 *
 * Exemple d'utilisation dans une route :
 *   router.post("/recipes", upload.single("image"), createRecipe);
 *
 * "image" correspond au nom du champ dans le formulaire (form-data).
 * Après le middleware, req.file contient les infos du fichier (chemin, taille, etc.)
 * ou est undefined si aucun fichier n'a été envoyé.
 *
 * limits.fileSize : rejette les fichiers trop lourds avant même de les stocker
 * limits.files    : limite à 1 fichier par requête
 */
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
});
