const express = require("express");
const {
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
  forgotPassword,
  changePassword,
  tokenPassword,
} = require("../controllers");
const { verifyToken, verifyLastToken } = require("../lib");

const Router = express.Router();
Router.post("/register", registerController);
Router.post("/login", loginController);
Router.get("/keep-login", verifyToken, keepLogin);
Router.post("/email-verification", emailVerification);
Router.get("/verification", verifyToken, verifyLastToken, verifyAccount);
Router.post("/forgot-password", forgotPassword);
Router.get("/token-password", verifyToken, verifyLastToken, tokenPassword);
Router.post("/change-password", verifyToken, verifyLastToken, changePassword);

module.exports = Router;
