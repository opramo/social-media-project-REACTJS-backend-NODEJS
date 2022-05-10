const { dbCon } = require("../connection");
const fs = require("fs");

const postRecipe = async (req, res) => {
  let path = "/post-photos";
  const data = JSON.parse(req.body.data);
  const { photo } = req.files;
  const { title, instructions, ingredients } = data;
  console.log(data);
  console.log(title);
  console.log(photo[0].filename);
  const photoPath = `${path}/${photo[0].filename}`;

  data.photo = photoPath;
  console.log(data);
  //   instructions.forEach((data, index) => {
  //       return
  //   });
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    //   title insert
    sql = `INSERT INTO posts SET title = ?, photo = ?, user_id = ?`;
    let [resultTitle] = await conn.query(sql, [title, data.photo, id]);
    console.log(resultTitle.insertId);
    //   ingredients
    sql = `INSERT INTO post_ingredients SET ingredient = ?, post_id= ?`;
    for (let step of ingredients) {
      let ingredient = step;
      await conn.query(sql, [ingredient, resultTitle.insertId]);
    }
    //   instructions
    sql = `INSERT INTO post_instructions SET instruction = ?, post_id= ?`;
    for (let step of instructions) {
      let instruction = step;
      await conn.query(sql, [instruction, resultTitle.insertId]);
    }
    //   get posts
    // sql = `SELECT * FROM posts JOIN post_ingredients ON (posts.post_id = post_ingredients.post_id) ORDER BY ingredients_id JOIN post_instructions ON (posts.post_id = post_instructions.post_id) WHERE post_id = ?`;
    // sql = `SELECT * FROM (SELECT * FROM posts JOIN post_ingredients ON (posts.post_id = post_ingredients.post_id)) a JOIN (SELECT * FROM posts JOIN post_instructions ON (posts.post_id = post_instructions.post_id)) b ON (a.post_id = b.post_id) WHERE a.post_id = ?`;

    sql = `SELECT post_id, photo, title, created_at, user_id FROM posts WHERE post_id = ?`;
    let [resultPost] = await conn.query(sql, resultTitle.insertId);
    sql = `SELECT ingredient_id, ingredient FROM post_ingredients WHERE post_id = ?`;
    let [resultIngredients] = await conn.query(sql, resultTitle.insertId);
    sql = `SELECT instruction_id, instruction FROM post_instructions WHERE post_id = ?
    `;
    let [resultInstructions] = await conn.query(sql, resultTitle.insertId);
    let result = {
      post: resultPost[0],
      ingredients: resultIngredients,
      instructions: resultInstructions,
    };

    conn.commit();
    conn.release();

    return res.status(200).send(result);
    // .send(resultPreview[0]);
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// EDIT RECIPE //

const editRecipe = async (req, res) => {
  let path = "/post-photos";
  const data = JSON.parse(req.body.data);
  const { photo } = req.files;
  const { title, instructions, ingredients, post_id } = data;
  console.log(data);
  console.log(title);
  console.log(photo[0].filename);
  const photoPath = `${path}/${photo[0].filename}`;

  data.photo = photoPath;
  console.log(data);
  //   instructions.forEach((data, index) => {
  //       return
  //   });
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    // check
    sql = `SELECT post_id, photo, title, created_at, user_id FROM posts WHERE post_id = ?`;
    let [prevPost] = await conn.query(sql, post_id);
    if (!prevPost.length) {
      throw { message: "recipe not found" };
    }
    //   title insert
    sql = `UPDATE posts SET title = ?, photo = ? WHERE post_id = ?`;
    await conn.query(sql, [title, data.photo, post_id]);

    //   ingredients
    sql = `DELETE FROM post_ingredients WHERE post_id = ?`;
    await conn.query(sql, post_id);
    sql = `INSERT INTO post_ingredients SET ingredient = ?, post_id= ?`;
    for (let step of ingredients) {
      let ingredient = step;
      await conn.query(sql, [ingredient, post_id]);
    }

    //   instructions
    sql = `DELETE FROM post_instructions WHERE post_id = ?`;
    await conn.query(sql, post_id);
    sql = `INSERT INTO post_instructions SET instruction = ?, post_id= ?`;
    for (let step of instructions) {
      let instruction = step;
      await conn.query(sql, [instruction, post_id]);
    }

    console.log(post_id);
    //   get posts
    // sql = `SELECT * FROM posts JOIN post_ingredients ON (posts.post_id = post_ingredients.post_id) ORDER BY ingredients_id JOIN post_instructions ON (posts.post_id = post_instructions.post_id) WHERE post_id = ?`;
    // sql = `SELECT * FROM (SELECT * FROM posts JOIN post_ingredients ON (posts.post_id = post_ingredients.post_id)) a JOIN (SELECT * FROM posts JOIN post_instructions ON (posts.post_id = post_instructions.post_id)) b ON (a.post_id = b.post_id) WHERE a.post_id = ?`;

    sql = `SELECT post_id, photo, title, created_at, user_id FROM posts WHERE post_id = ?`;
    let [resultPost] = await conn.query(sql, post_id);
    sql = `SELECT ingredient_id, ingredient FROM post_ingredients WHERE post_id = ?`;
    let [resultIngredients] = await conn.query(sql, post_id);
    sql = `SELECT instruction_id, instruction FROM post_instructions WHERE post_id = ?
    `;
    let [resultInstructions] = await conn.query(sql, post_id);
    let result = {
      post: resultPost[0],
      ingredients: resultIngredients,
      instructions: resultInstructions,
    };
    fs.unlinkSync("./public" + prevPost[0].photo);

    conn.commit();
    conn.release();

    return res.status(200).send(result);
    // .send(resultPreview[0]);
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// DELETE RECIPE //

const deleteRecipe = async (req, res) => {
  console.log(req.body);
  let { post_id } = req.body;
  console.log(`this is post id: ${post_id}`);
  post_id = parseInt(post_id);

  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM posts where post_id = ?`;
    let [result] = await conn.query(sql, post_id);
    console.log(result);
    if (result[0].photo) {
      fs.unlinkSync("./public" + result[0].photo);
    }
    sql = `DELETE FROM posts WHERE post_id = ?`;
    await conn.query(sql, post_id);
    sql = `DELETE FROM post_ingredients WHERE post_id = ?`;
    await conn.query(sql, post_id);
    sql = `DELETE FROM post_instructions WHERE post_id = ?`;
    await conn.query(sql, post_id);
    sql = `DELETE FROM likes WHERE post_id = ?`;
    await conn.query(sql, post_id);
    sql = `DELETE FROM comments WHERE post_id = ?`;
    await conn.query(sql, post_id);
    conn.commit();
    conn.release();
    return res.status(200).send({ message: "deleted!" });
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const likeRecipe = async (req, res) => {
  let { post_id } = req.body;
  const { id } = req.user;
  post_id = parseInt(post_id);
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM likes WHERE user_id = ? AND post_id = ?`;
    let [result] = await conn.query(sql, [id, post_id]);
    if (!result.length) {
      sql = `INSERT INTO likes SET user_id = ?, post_id = ?`;
      await conn.query(sql, [id, post_id]);
      conn.release();
      conn.commit();
      return res.status(200).send({ message: "liked!" });
    }
    sql = `DELETE FROM likes WHERE user_id = ? AND post_id = ?`;
    await conn.query(sql, [id, post_id]);
    conn.commit();
    conn.release();
    return res.status(200).send({ message: "unliked!" });
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const commentRecipe = async (req, res) => {
  const { id } = req.user;
  console.log(`id :${id}`);
  const { comment, post_id } = req.body;
  console.log(comment);
  console.log(post_id);

  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `INSERT INTO comments SET ?`;
    let insertComment = {
      post_id,
      comment,
      user_id: id,
    };
    await conn.query(sql, insertComment);
    // get comments
    sql = `SELECT * FROM comments WHERE post_id = ?`;
    let [result] = await conn.query(sql, post_id);
    conn.release();
    return res.status(200).send(result);
  } catch (error) {
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

module.exports = {
  postRecipe,
  deleteRecipe,
  editRecipe,
  likeRecipe,
  commentRecipe,
};