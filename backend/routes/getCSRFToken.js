import express from "express";
import csrf from "csurf";
import { cookieOpts } from "../config/config.js";
import { SAML } from "@node-saml/passport-saml";
import passport from "passport";

const router = express.Router();

router.use(csrf({ cookie: cookieOpts }));

router.get("/", async (req, res) => {
  const saml = new SAML({
    callbackUrl: "http://localhost:3001/app/user/sso/callback",
    issuer: "https://qdrive.space",
    idpCert: "public key from idp",
    entryPoint: "http://localhost:3001/app/user/sso/login",
  });

  const url = await saml.getAuthorizeUrlAsync({});
  console.log(url);

  const CSRFToken = req.csrfToken();
  res.status(200).json({ CSRFToken });
});

export { router as csrftoken };
