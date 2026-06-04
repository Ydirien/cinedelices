import nodemailer from "nodemailer";
import { config } from "../../config.ts";

export const transporter = nodemailer.createTransport({
    host: config.mailtrap.host as string,
    port: Number(config.mailtrap.port),
    auth: {
        user: config.mailtrap.user as string,
        pass: config.mailtrap.pass as string,
    }
});

export async function sendResetPasswordEmail(email: string, resetToken: string) {
    await transporter.sendMail({
        from: "no-reply@monapp.com",
        to: email,
        subject: "Reset your password",
        html: `
            <p>Click the link below to reset your password :</p>
            <a href="${config.frontEndUrl}/reset-password?token=${resetToken}">Reset my password</a>
            <p>This link expires in 15 minutes.</p>
        `
    });
}