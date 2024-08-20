import { TOTPHTMLTemplate } from "./TOTPHTMLTemplate.js";
import { MailService } from "./sendGrid.js";
export const sendEmail = (name, email, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const msg = {
        to: email,
        from: "no-reply@qdrive.space",
        subject: `${name}, Your verification code to sign in to your QDrive account`,
        html: TOTPHTMLTemplate(name, token),
      };
      await MailService.send(msg);
      resolve(`OTP Sent to ${email}`);
    } catch (err) {
      reject(err);
    }
  });
};
