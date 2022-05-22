const express = require("express");
const {
  postRecipe,
  editRecipe,
  deleteRecipe,
  likeRecipe,
  commentRecipe,
  getRecipesFeed,
  getRecipesLikers,
  getRecipesComments,
  getRecipe,
  getRecipesUser,
  getLikedRecipes,
  getRecipesRecipe,
  deleteComment,
} = require("../controllers");
const { upload, verifyToken } = require("../lib");

const Router = express.Router();

const uploader = upload("/post-photos", "POST").fields([
  { name: "photo", maxCount: 1 },
]);

// Recipe Manipulation
Router.post("/post-recipe", verifyToken, uploader, postRecipe);
Router.patch("/edit-recipe", verifyToken, uploader, editRecipe);
Router.post("/delete-recipe", verifyToken, deleteRecipe);
Router.post("/like-recipe", verifyToken, likeRecipe);
Router.post("/comment-recipe", verifyToken, commentRecipe);
Router.delete("/delete-comment", verifyToken, deleteComment);

// Recipe Fetching
Router.get("/recipes-feed", verifyToken, getRecipesFeed);
Router.get("/recipes-user", getRecipesUser);
Router.get("/recipes-liked", getLikedRecipes);
Router.get("/recipe-detail", getRecipe);
Router.post("/recipe-likers", getRecipesLikers);
Router.post("/recipe-comments", getRecipesComments);
Router.post("/recipe-recipe", getRecipesRecipe);

module.exports = Router;
