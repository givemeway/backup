import MailService from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

MailService.setApiKey(process.env.SENDGRID_API_KEY);

export { MailService };
