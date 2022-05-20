const {
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
  forgotPassword,
  changePassword,
  tokenPassword,
} = require("./authControllers");
const {
  deleteRecipe,
  postRecipe,
  editRecipe,
  likeRecipe,
  commentRecipe,
} = require("./recipeController");
const { updateProfile } = require("./profileControllers");
const {
  getRecipesFeed,
  getRecipesLikers,
  getRecipesComments,
  getRecipe,
  getRecipesUser,
  getLikedRecipes,
  getRecipesRecipe,
} = require("./recipeFetchController");

module.exports = {
  tokenPassword,
  changePassword,
  getRecipesRecipe,
  getLikedRecipes,
  getRecipesUser,
  getRecipe,
  getRecipesComments,
  getRecipesLikers,
  getRecipesFeed,
  commentRecipe,
  likeRecipe,
  editRecipe,
  postRecipe,
  deleteRecipe,
  updateProfile,
  forgotPassword,
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
};
