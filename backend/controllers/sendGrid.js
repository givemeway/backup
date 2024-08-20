import MailService from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

MailService.setApiKey(process.env.SENDGRID_API_KEY);

export { MailService };
