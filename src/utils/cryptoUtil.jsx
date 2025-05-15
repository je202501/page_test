import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
  return encodeURIComponent(encrypted); 
};

export const decryptId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId); 
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || null;
  } catch (err) {
    console.error("복호화 에러", err);
    return null;
  }
};
