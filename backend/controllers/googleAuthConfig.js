import base32Encode from "base32-encode";
import { authenticator } from "@otplib/preset-default";
import qrcode from "qrcode";

export const google_authenticator = async (username, secret) => {
  const unsignedArrBuff = Buffer.from(secret.toUpperCase(), "hex");
  const base32_secret = base32Encode(unsignedArrBuff, "RFC4648", {
    padding: false,
  });
  const uri = authenticator.keyuri(username, "QDrive", base32_secret);
  const qrcodeImgUrl = await qrcode.toDataURL(uri);
  return qrcodeImgUrl;
};
