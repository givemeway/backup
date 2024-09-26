import { SAML } from "@node-saml/passport-saml";
import passport from "passport";

const saml = new SAML({
  callbackUrl: "",
  issuer: "https://qdrive.space",
  idpCert: "public key from idp",
  entryPoint: "",
});

export const setupSAML = (req, res, next) => {
  const url = saml.getAuthorizeUrlAsync({});
  next();
};
