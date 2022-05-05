const { dbCon } = require("../connection");

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

    sql = `UPDATE users JOIN user_details ON (users.id = user_details.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);
    if (imagePathAva || imagePathCov) {
      // klo image baru ada maka hapus image lama
      if (result[0].profile_picture) {
        fs.unlinkSync(`./public${result[0].profile_picture}`);
      }
      if (result[0].profile_cover) {
        fs.unlinkSync(`./public${result[0].profile_cover}`);
      }
    }
  } catch (error) {
    if (imagePathAva) {
      fs.unlinkSync("./public" + imagePathAva);
    }
    if (imagePathCov) {
      fs.unlinkSync("./public" + imagePathCov);
    }
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};
