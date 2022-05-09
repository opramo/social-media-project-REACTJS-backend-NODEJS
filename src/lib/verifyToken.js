const jwt = require("jsonwebtoken");
const myCache = require("./cache");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(`authHeader :"${authHeader}"`);

  let key = process.env.JWT_SECRET;

  try {
    let decode = jwt.verify(authHeader, key);
    console.log("decode:", decode);
    req.user = decode;
    next();
  } catch (error) {
    console.log(`gagal lewat verify token`);
    return res.status(401).send({ message: "User Unauthorized" });
  }
};

const verifyLastToken = (req, res, next) => {
  const { createdAt, id } = req.user;
  let cache = myCache.get(id);
  console.log(cache);
  // if (createdAt === cache.createdAt) {
  // } else {
  if (cache) {
    next();
  } else {
    console.log(`gagal lewat verify last token`);
    return res.status(401).send({ message: "User Unauthorized" });
  }
  // }
};

module.exports = { verifyToken, verifyLastToken };
// const verifyTokenEmail = async (req, res, next) => {
//     const authHeader = req.headers["authorization"];
//     let token;

//     if (authHeader) {
//       token = authHeader.split(" ")[1] ? authHeader.split(" ")[1] : authHeader;

//       console.log(token);
//     } else {
//       token = null;
//     }

//     let key = process.env.JWT_SECRET;
//     try {
//       let decode = jwt.verify(token, key);
//       req.user = decode;
//       next();
//     } catch (error) {
//       console.log(error);
//       return res.status(401).send({ message: "User anauthorized" });
//     }
// }
