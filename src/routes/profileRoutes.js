const express = require("express");
const { updateProfile, updatePhoto } = require("../controllers");
const { verifyToken, upload } = require("../lib");

// const uploader = upload.array("profile-photos", 2);
const uploader = upload("/profile-photos", "PROFILE").fields([
  { name: "profile_picture", maxCount: 1 },
  { name: "profile_cover", maxCount: 1 },
]);

const Router = express.Router();
Router.patch("/profile-update", verifyToken, uploader, updateProfile);
// Router.patch("/photos-update", verifyToken, , updatePhoto);

module.exports = Router;
