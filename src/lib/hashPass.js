const bcrypt = require("bcrypt");

const saltRounds = 5;

const hashRegister = async (password) => {
  try {
    let hashing = await bcrypt.hash(password, saltRounds);
    console.log(hashing);
    return hashing;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// log in
const hashLogIn = async (password, hashedPassword) => {
  try {
    let match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    return false;
  }
};

module.exports = { hashRegister, hashLogIn };

// const hashRegister = (password) => {
//   let hashing = crypto
//     .createHmac("sha256", "passwordhashing")
//     .update(password)
//     .digest("hex");
//   return hashing;
// };

// CARA BCRYPT
///////////////////////////////////
// sign up
// const bcrypt = async (password) => {
//   try {
//     let hashing = await bcrypt.hash(password, 2);
//     return hashing;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
