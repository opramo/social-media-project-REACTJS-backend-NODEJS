const express = require("express");
const {
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
  forgetPassword,
} = require("../controllers");
const { verifyToken, verifyLastToken } = require("../lib");

const Router = express.Router();
Router.post("/register", registerController);
Router.post("/login", loginController);
Router.get("/keepLogin", verifyToken, keepLogin);
Router.post("/email-verification", emailVerification);
Router.get("/verification", verifyToken, verifyLastToken, verifyAccount);
Router.post("/forgot-password", forgetPassword);

module.exports = Router;
