const { dbCon } = require("../connection");
const fs = require("fs");

const updateProfile = async (req, res) => {
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
    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id not found" };
    }
    sql = `SELECT id FROM users WHERE username = ?`;
    let [usernameFound] = await conn.query(sql, data.username);
    // error jika tidak unique
    if (usernameFound.length && usernameFound[0].id !== id) {
      throw {
        message: "Username has already been used! Try a different one!",
      };
    }
    sql = `UPDATE users JOIN user_details ON (users.id = user_details.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);
    if (imagePathAva && result[0].profile_picture) {
      fs.unlinkSync(`./public${result[0].profile_picture}`);
    }

    if (imagePathCov && result[0].profile_cover) {
      fs.unlinkSync(`./public${result[0].profile_cover}`);
    }

    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    let [result1] = await conn.query(sql, id);
    await conn.commit();
    conn.release();
    return res.status(200).send(result1[0]);
    // get data
  } catch (error) {
    if (imagePathAva) {
      fs.unlinkSync("./public" + imagePathAva);
    }
    if (imagePathCov) {
      fs.unlinkSync("./public" + imagePathCov);
    }
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const getUserDetails = async (req, res) => {
  console.log(req.query);
  const { profile_username } = req.query;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.username = ?`;
    let [result1] = await conn.query(sql, profile_username);
    if (!result1.length) {
      throw { message: "Chef not found" };
    }
    return res.status(200).send(result1[0]);
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

module.exports = { updateProfile, getUserDetails };
