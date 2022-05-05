const {
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
} = require("./authControllers");
const { updateProfile, updatePhoto } = require("./profileControllers");
module.exports = {
  updatePhoto,
  updateProfile,
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
};
