const { dbCon } = require("../connection");

// Fetching recipes on home page
const getRecipesFeed = async (req, res) => {
  const { id } = req.user;
  console.log(req);
  let { page, limit } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = page * limit;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM posts ORDER BY updated_at DESC LIMIT ?,?`;
    let [result] = await conn.query(sql, [offset, limit]);

    // user
    sql = `SELECT users.username, user_details.profile_picture, user_details.fullname FROM users JOIN user_details ON users.id = user_details.user_id WHERE users.id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultUser] = await conn.query(sql, post.user_id);
      result[i] = { ...result[i], user: resultUser[0] };
    }

    // likes
    sql = `SELECT COUNT(*) likes FROM likes WHERE post_id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultLikes] = await conn.query(sql, post.post_id);
      result[i] = { ...result[i], likes: resultLikes[0].likes };
    }

    // check liked
    sql = `SELECT likes.user_id as liked FROM likes JOIN posts ON likes.post_id = posts.post_id WHERE posts.post_id = ? AND likes.user_id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultLiked] = await conn.query(sql, [post.post_id, id]);
      let liked = resultLiked.length ? 1 : 0;
      result[i] = { ...result[i], liked };
    }
    await conn.commit();
    conn.release();
    return res.status(200).send(result);
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// Fetching User's recipes
const getRecipesUser = async (req, res) => {
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM posts WHERE user_id = ? ORDER BY updated_at DESC`;
    let [result] = await conn.query(sql, id);

    // user
    sql = `SELECT users.username, user_details.profile_picture, user_details.fullname FROM users JOIN user_details ON users.id = user_details.user_id WHERE users.id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultUser] = await conn.query(sql, post.user_id);
      result[i] = { ...result[i], user: resultUser[0] };
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
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// Fetching User's liked recipes
const getLikedRecipes = async (req, res) => {
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT posts.* FROM likes JOIN posts ON likes.post_id = posts.post_id WHERE likes.user_id = ? ORDER BY updated_at DESC`;
    let [result] = await conn.query(sql, id);

    // user
    sql = `SELECT users.username, user_details.profile_picture, user_details.fullname FROM users JOIN user_details ON users.id = user_details.user_id WHERE users.id = ?`;
    for (let i = 0; i < result.length; i++) {
      let post = result[i];
      let [resultUser] = await conn.query(sql, post.user_id);
      result[i] = { ...result[i], user: resultUser[0] };
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
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// Fetching sers who liked the recipe
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

// Fetching comments of the recipe
const getRecipesComments = async (req, res) => {
  const { post_id } = req.body;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT comments.comment, comments.id, comments.user_id, users.username, user_details.fullname, user_details.profile_picture FROM comments JOIN users ON comments.user_id = users.id JOIN user_details ON comments.user_id = user_details.user_id WHERE post_id = ? ORDER BY comments.id DESC`;

    let [comments] = await conn.query(sql, post_id);
    return res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// Fetching ingredients and instructions of the recipe
const getRecipesRecipe = async (req, res) => {
  const { post_id } = req.body;
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    //ingredients
    sql = `SELECT ingredient, ingredient_id FROM post_ingredients WHERE post_id = ?`;
    let [ingredients] = await conn.query(sql, post_id);

    //instructions
    sql = `SELECT instruction, instruction_id FROM post_instructions WHERE post_id = ?`;
    let [instructions] = await conn.query(sql, post_id);
    conn.release();
    let recipe = { ingredients, instructions };
    return res.status(200).send(recipe);
  } catch (error) {
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// Fetching recipe detail
const getRecipe = async (req, res) => {
  const { post_id, id } = req.body;
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT * FROM posts WHERE post_id = ?`;
    let [resultPost] = await conn.query(sql, post_id);
    sql = `SELECT users.username, user_details.profile_picture, user_details.fullname FROM users JOIN user_details ON users.id = user_details.user_id WHERE users.id = ?`;
    let [resultUser] = await conn.query(sql, resultPost[0].user_id);
    sql = `SELECT ingredient, ingredient_id FROM post_ingredients WHERE post_id = ?`;
    let [resultIngredients] = await conn.query(sql, post_id);
    sql = `SELECT instruction, instruction_id FROM post_instructions WHERE post_id = ?
    `;
    let [resultInstructions] = await conn.query(sql, post_id);
    // likes
    sql = `SELECT COUNT(*) likes FROM likes WHERE post_id = ?`;
    let [resultLikes] = await conn.query(sql, post_id);

    // check liked
    let liked;
    if (id) {
      sql = `SELECT likes.user_id as liked FROM likes JOIN posts ON likes.post_id = posts.post_id WHERE posts.post_id = ? AND likes.user_id = ?`;
      let [resultLiked] = await conn.query(sql, [post_id, id]);
      liked = resultLiked.length ? 1 : 0;
    } else {
      liked = 0;
    }

    // who liked
    sql = `SELECT likes.user_id, likes.id, users.username, user_details.fullname, user_details.profile_picture FROM likes JOIN users ON likes.user_id = users.id JOIN user_details ON likes.user_id = user_details.user_id WHERE post_id = ? ORDER BY likes.id DESC;`;
    let [resultWhoLikes] = await conn.query(sql, post_id);

    // comments
    sql = `SELECT comments.comment, comments.user_id, comments.id, users.username, user_details.fullname, user_details.profile_picture FROM comments JOIN users ON comments.user_id = users.id JOIN user_details ON comments.user_id = user_details.user_id WHERE post_id = ? ORDER BY comments.id DESC`;
    let [comments] = await conn.query(sql, post_id);

    let result = {
      post: resultPost[0],
      user: resultUser[0],
      ingredients: resultIngredients,
      instructions: resultInstructions,
      likes: resultLikes[0].likes,
      likers: resultWhoLikes,
      liked,
      comments,
    };
    conn.commit();
    conn.release();
    return res.status(200).send(result);
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

module.exports = {
  getRecipesRecipe,
  getLikedRecipes,
  getRecipe,
  getRecipesUser,
  getRecipesFeed,
  getRecipesLikers,
  getRecipesComments,
};
