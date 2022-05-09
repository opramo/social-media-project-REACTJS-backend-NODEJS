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

module.exports = {
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
