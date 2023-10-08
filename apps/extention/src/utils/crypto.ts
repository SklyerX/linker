import CryptoJS from "crypto-js";

const secretKey = "YourSecretKey";

export const encrypt = (dataToEncrypt: string) => {
  const encryptedData = CryptoJS.AES.encrypt(
    dataToEncrypt,
    secretKey
  ).toString();

  return encryptedData;
};
