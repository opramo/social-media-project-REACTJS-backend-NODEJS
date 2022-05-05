const { dbCon } = require("../connection");
const fs = require("fs");

// const updateProfile = async (req, res) => {
//   const { fullname, username, bio } = req.body;
//   const { id } = req.user;
//   let conn, sql;
//   try {
//     conn = await dbCon.promise().getConnection();
//     await conn.beginTransaction();
//     // cek username unique atau tidak

//     sql = `SELECT id FROM users WHERE username = ?`;
//     let [usernameFound] = await conn.query(sql, username);
//     console.log(usernameFound);
//     // error jika tidak unique
//     if (usernameFound.length && usernameFound[0].id !== id) {
//       throw {
//         message: "Username has already been used! Try a different one!",
//       };
//     }

//     // update jika unique
//     sql = `UPDATE users JOIN user_details ON (users.id = user_details.user_id) SET users.username = ?, user_details.fullname = ?, user_details.bio = ? WHERE users.id = ?`;
//     await conn.query(sql, [username, fullname, bio, id]);

//     // kembalikan result hasil mengganti details
//     sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
//     let [result] = await conn.query(sql, id);
//     await conn.commit();
//     conn.release();
//     return res.status(200).send(result[0]);
//   } catch (error) {
//     conn.rollback();
//     conn.release();
//     console.log(error);
//     return res.status(500).send({ message: error.message || error });
//   }
// };

const updateProfile = async (req, res) => {
  console.log("Isi req.files", req.files);
  console.log("Isi req.body", req.body);
  let path = "/profile-photos";
  let pathAva = "/profile-picture";
  let pathCov = "/profile-cover";
  const data = JSON.parse(req.body.data);
  const { profile_picture, profile_cover } = req.files;
  const imagePathAva = profile_picture
    ? `${path}${pathAva}/${profile_picture[0].filename}`
    : null;
  const imagePathCov = profile_cover
    ? `${path}${pathCov}/${profile_cover[0].filename}`
    : null;

  if (imagePathAva) {
    data.profile_picture = imagePathAva;
  }
  if (imagePathCov) {
    data.profile_cover = imagePathCov;
  }
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    let sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id not found" };
    }
    sql = `UPDATE users JOIN user_details ON (users.id = user_details.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);
    // if (imagePathAva || imagePathCov) {
    //   // klo image baru ada maka hapus image lama

    //   if (result[0].profile_picture) {
    //     fs.unlinkSync(`./public${result[0].profile_picture}`);
    //   }
    //   if (result[0].profile_cover) {
    //     fs.unlinkSync(`./public${result[0].profile_cover}`);
    //   }
    // }
    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    let [result1] = await conn.query(sql, id);
    await conn.commit();
    conn.release();
    return res.status(200).send(result1[0]);
    // get data
  } catch (error) {
    // if (imagePathAva) {
    //   fs.unlinkSync("./public" + imagePathAva);
    // }
    // if (imagePathCov) {
    //   fs.unlinkSync("./public" + imagePathCov);
    // }
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// const updatePhoto = async (req, res) => {
//   const { id } = req.user;
//   console.log(`line 42, isi req.files:`, req.files);
//   // console.log(`line 43, isi req.body:`, req.body);
//   const path = "/profile-photos";
//   let pathAva = "/avatar";
//   let pathCov = "/cover";
//   // const data = JSON.parse(req.body.data);
//   const { profile_picture, profile_cover } = req.files;
//   let imagePathAva = profile_picture
//     ? `${path}${pathAva}/${profile_picture[0].filename}`
//     : false;
//   console.log(imagePathAva);
//   let imagePathCov = profile_cover
//     ? `${path}${pathCov}/${profile_cover[0].filename}`
//     : false;
//   console.log(imagePathCov);
//   let conn, sql;
//   try {
//     conn = await dbCon.promise().getConnection();
//     sql = `UPDATE user_details SET ? WHERE user_id = ?`;
//     if (imagePathAva && imagePathCov) {
//       let updatePhotoData = {
//         profile_picture: imagePathAva,
//         profile_cover: imagePathCov,
//       };
//       await conn.query(sql, [updatePhotoData, id]);
//     }
//     if (!imagePathAva) {
//       // imagePathAva = false;
//       let updatePhotoData = {
//         // profile_picture: imagePathAva,
//         profile_cover: imagePathCov,
//       };
//       await conn.query(sql, [updatePhotoData, id]);
//     }
//     if (!imagePathCov) {
//       // imagePathCov = false;
//       let updatePhotoData = {
//         profile_picture: imagePathAva,
//         // profile_cover: imagePathCov,
//       };
//       await conn.query(sql, [updatePhotoData, id]);
//     }
//     sql = `SELECT profile_picture, profile_cover FROM user_details WHERE user_id = ?`;
//     let [result] = await conn.query(sql, id);
//     conn.release();
//     return res.status(200).send(result[0]);
//   } catch (error) {
//     console.log(error);
//     conn.release();
//     return res.status(500).send({ message: error.message || error });
//   }
// };
module.exports = { updateProfile };
