const express = require("express");
const {
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
} = require("../controllers");
const { verifyToken, verifyLastToken } = require("../lib");

const Router = express.Router();
Router.post("/register", registerController);
Router.post("/login", loginController);
Router.get("/keepLogin", verifyToken, keepLogin);
Router.post("/email-verification", emailVerification);
// verifyLastToken
Router.get("/verification", verifyToken, verifyAccount);

module.exports = Router;
