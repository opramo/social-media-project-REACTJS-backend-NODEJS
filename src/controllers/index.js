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
  deleteComment,
} = require("./recipeController");
const { updateProfile, getUserDetails } = require("./profileControllers");
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
  getUserDetails,
  deleteComment,
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
