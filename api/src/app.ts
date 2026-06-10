import express from "express";
import cors from "cors";
import {helmetMiddleware} from "./middlewares/helmet.middleware.ts";
import { xssSanitizer } from "./middlewares/xss-sanitizer.ts";
import { globalErrorHandler } from "./middlewares/global-error-handler.ts";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.ts";
import { router as apiRouter } from "./routes/index.ts";
import { config } from "../config.ts";


// Créer une app Express
export const app = express();

// Sécuriser les headers HTTP
app.use(helmetMiddleware);

// Autoriser les requêtes cross-origin
app.use(cors({ origin: config.allowedOrigins }));

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Nettoyer les chaînes du body pour prévenir les injections XSS
app.use(xssSanitizer);

// Brancher le routeur de l'API
app.use("/api", apiRouter);

// Brancher le dossier upload
app.use('/uploads',express.static('uploads'))

// Not found middleware
app.use(notFoundMiddleware);

// Global error middleware
app.use(globalErrorHandler);