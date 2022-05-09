const express = require("express");
const {
  postRecipe,
  editRecipe,
  deleteRecipe,
  likeRecipe,
  commentRecipe,
} = require("../controllers");
const { upload, verifyToken } = require("../lib");

const Router = express.Router();
verifyToken;
const uploader = upload("/post-photos", "POST").fields([
  { name: "photo", maxCount: 1 },
]);

// Recipe Manipulation
Router.post("/post-recipe", verifyToken, uploader, postRecipe);
Router.patch("/edit-recipe", verifyToken, uploader, editRecipe);
Router.delete("/delete-recipe", verifyToken, deleteRecipe);
Router.post("/like-recipe", verifyToken, likeRecipe);
Router.post("/comment-recipe", verifyToken, commentRecipe);

module.exports = Router;
