const jwt = require("jsonwebtoken");

const createJWTEmail = (data) =>
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1m" });
const createJwtAccess = (data) =>
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "2h" });

module.exports = {
  createJWTEmail,
  createJwtAccess,
};
