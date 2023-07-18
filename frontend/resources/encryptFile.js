const generateRandomBytes = (len) => {
  let buffer = new Uint8Array(len);
  crypto.getRandomValues(buffer);
  return buffer;
};

const getPasswordkey = (key) => {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(key), "PBKDF2", false, [
    "deriveKey",
  ]);
};

const encryptFile = (file, enc_key) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrBuffer = event.target.result;
      const salt = generateRandomBytes(32);
      const iv = generateRandomBytes(16);
      const algo_options = {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      };
      const passwordKey = await getPasswordkey(enc_key);
      const derivedKey = await crypto.subtle.deriveKey(
        algo_options,
        passwordKey,
        { name: "AES-CBC", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      resolve({
        encryptedFile: await crypto.subtle.encrypt(
          { name: "AES-CBC", iv },
          derivedKey,
          arrBuffer
        ),
        salt,
        iv,
      });
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
};

export { encryptFile };
