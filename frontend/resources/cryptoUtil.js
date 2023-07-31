const encryptMessage = (algorithm, text, key, iv) => {
  let enc = new TextEncoder();
  const cipher = forge.cipher.createCipher(algorithm, key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(enc.encode(text)));
  cipher.finish();
  return cipher.output.toHex();
};
const deriveKey = (password, salt, iterations, length) => {
  const md = forge.md.sha256.create();
  const key = forge.pkcs5.pbkdf2(password, salt, iterations, length / 8, md);
  return key;
};

export { deriveKey, encryptMessage };
