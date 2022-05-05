const myCache = require("./cache");
const { hashRegister, hashLogIn } = require("./hashPass");
const { createJWTEmail, createJwtAccess } = require("./jwt");
const transporter = require("./transporter");
const { upload } = require("./upload");
const { verifyToken, verifyLastToken } = require("./verifyToken");

module.exports = {
  myCache,
  transporter,
  upload,
  verifyToken,
  hashRegister,
  hashLogIn,
  createJWTEmail,
  createJwtAccess,
  verifyLastToken,
};
