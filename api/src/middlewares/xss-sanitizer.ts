import { xss } from "express-xss-sanitizer";
import type { RequestHandler } from "express";

export const xssSanitizer: RequestHandler = xss();