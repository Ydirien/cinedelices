import express from "express";
import cors from "cors";
import {helmetMiddleware} from "./middlewares/helmet.middleware.ts";
import { xssSanitizer } from "./middlewares/xss-sanitizer.ts";


export const app = express();

app.use(helmetMiddleware);
app.use(cors());
app.use(express.json());
app.use(xssSanitizer);

app.get("/", (_req, res) => {
  res.json({ message: "API OK" });
});