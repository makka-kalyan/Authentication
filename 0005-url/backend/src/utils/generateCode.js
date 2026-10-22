import crypto from "crypto";

/* 
Generate a 6 charcter long unique short code for URLs which contains on a-z, A-Z, and 0-9.
 */

const generateCode = () => {
  // return crypto.randomBytes(4).toString("base64url").slice(0, 6);
  // console.log(crypto.randomBytes(6).toString("base64").slice(0, 6));

  const mainstring =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let shortCode = "";

  for (let i = 0; i < 6; i++) {
    shortCode += mainstring.charAt(Math.floor(Math.random() * 62));
  }
  return shortCode;
};

export default generateCode;
