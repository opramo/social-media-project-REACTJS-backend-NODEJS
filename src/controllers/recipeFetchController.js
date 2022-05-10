const { dbCon } = require("../connection");

const getRecipesFeed = async (req, res) => {
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM posts ORDER BY updated_at DESC`;
    let [result] = await conn.query(sql);

    // user
    sql = `SELECT users.username, user_details.profile_picture, user_details.fullname FROM users JOIN user_details ON users.id = user_details.user_id WHERE users.id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultUser] = await conn.query(sql, post.user_id);
      result[i] = { ...result[i], user: resultUser[0] };
    }
    //ingredients
    sql = `SELECT ingredient, ingredient_id FROM post_ingredients WHERE post_id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [ingredients] = await conn.query(sql, post.post_id);
      result[i] = { ...result[i], ingredients };
    }

    //instructions
    sql = `SELECT instruction, instruction_id FROM post_instructions WHERE post_id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [instructions] = await conn.query(sql, post.post_id);
      result[i] = { ...result[i], instructions };
    }
    // likes
    sql = `SELECT COUNT(*) likes FROM likes WHERE post_id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultLikes] = await conn.query(sql, post.post_id);
      result[i] = { ...result[i], likes: resultLikes[0].likes };
    }

    // who liked
    sql = `SELECT likes.user_id, likes.id, users.username, user_details.fullname, user_details.profile_picture FROM likes JOIN users ON likes.user_id = users.id JOIN user_details ON likes.user_id = user_details.user_id WHERE post_id = ? ORDER BY likes.id DESC;`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultWhoLikes] = await conn.query(sql, post.post_id);
      result[i] = { ...result[i], user_likes: resultWhoLikes };
    }

    // check liked
    sql = `SELECT likes.user_id as liked FROM likes JOIN posts ON likes.post_id = posts.post_id WHERE posts.post_id = ? AND likes.user_id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultLiked] = await conn.query(sql, [post.post_id, id]);
      let liked = resultLiked.length ? 1 : 0;
      result[i] = { ...result[i], liked };
    }

    // comments
    sql = `SELECT comments.comment, comments.id, users.username, user_details.fullname, user_details.profile_picture FROM comments JOIN users ON comments.user_id = users.id JOIN user_details ON comments.user_id = user_details.user_id WHERE post_id = ? ORDER BY comments.id DESC`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [comments] = await conn.query(sql, post.post_id);
      console.log(comments);
      result[i] = { ...result[i], comments };
    }

    conn.release();
    return res.status(200).send(result);
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const getRecipesLikers = async (req, res) => {
  const { post_id } = req.body;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT likes.user_id, likes.id, users.username, user_details.fullname, user_details.profile_picture FROM likes JOIN users ON likes.user_id = users.id JOIN user_details ON likes.user_id = user_details.user_id WHERE post_id = ? ORDER BY likes.id DESC;`;
    let [resultWhoLikes] = await conn.query(sql, post_id);
    return res.status(200).send(resultWhoLikes);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};
module.exports = {
  getRecipesFeed,
  getRecipesLikers,
};
