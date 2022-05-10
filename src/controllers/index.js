const {
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
} = require("./authControllers");
const {
  deleteRecipe,
  postRecipe,
  editRecipe,
  likeRecipe,
  commentRecipe,
} = require("./recipeController");
const { updateProfile } = require("./profileControllers");
const { getRecipesFeed, getRecipesLikers } = require("./recipeFetchController");

module.exports = {
  getRecipesLikers,
  getRecipesFeed,
  commentRecipe,
  likeRecipe,
  editRecipe,
  postRecipe,
  deleteRecipe,
  updateProfile,
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
};
