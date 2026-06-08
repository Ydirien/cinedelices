import rateLimit from "express-rate-limit";

const registerRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { status: 429, error: "Too many requests, please try again later" },
});

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { status: 429, error: "Too many requests, please try again later" },
});

const refreshRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { status: 429, error: "Too many requests, please try again later" },
});

const forgetPasswordRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { status: 429, error: "Too many requests, please try again later" },
});

export const rateLimiters = {
    register: registerRateLimiter,
    login: loginRateLimiter,
    refresh: refreshRateLimiter,
    forgetPassword: forgetPasswordRateLimiter,
};