const { registerService } = require("../services");
const {
  myCache,
  createJwtAccess,
  createJWTEmail,
  transporter,
  hashRegister,
} = require("../lib");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const { dbCon } = require("../connection");
const { loginService } = require("../services/authService");
const db = require("../connection/mysqldb");

const registerController = async (req, res) => {
  try {
    const { data: userData } = await registerService(req.body);
    let createdAt = new Date().getTime();
    const dataToken = {
      id: userData.id,
      username: userData.username,
      createdAt,
    };

    // belajar lagi tentang cache
    let cached = myCache.set(userData.id, dataToken, 300);
    if (!cached) {
      throw { message: "error while doing caching." };
    }

    // Variable host untuk pemilihan host mana yang dipakai tergantung pada node_env
    const tokenEmail = createJWTEmail(dataToken);
    const host =
      process.env.NODE_ENV === "production"
        ? "http://domainasli"
        : "http://localhost:3000";
    const link = `${host}/verification/${tokenEmail}`;

    // Pengiriman email verifikasi ke user saat sudah melakukan register
    let filepath = path.resolve(
      __dirname,
      "../templates/templateEmailHTML.html"
    );

    let htmlString = fs.readFileSync(filepath, "utf-8");
    const template = handlebars.compile(htmlString);
    const htmlToEmail = template({ username: userData.username, link });

    // Pengiriman email
    transporter.sendMail({
      from: "TheChefBook <lbrqspurs@gmail.com>",
      to: userData.email,
      subject: "TheChefBook Account Verification E-mail",
      html: htmlToEmail,
    });

    // Pengiriman data user dan token akses ke website untuk keperluan log in
    const tokenAccess = createJwtAccess(dataToken);

    res.set("x-token-access", tokenAccess);
    return res.status(200).send(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

// Log In Controller

const loginController = async (req, res) => {
  try {
    const { data: userData } = await loginService(req.body);

    const dataToken = {
      id: userData.id,
      username: userData.username,
    };

    const tokenAccess = createJwtAccess(dataToken);
    res.set("x-token-access", tokenAccess);
    return res.status(200).send(userData);
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

// Keep Log In Controller

const keepLogin = async (req, res) => {
  const { id } = req.user;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT * FROM users WHERE id = ?`;
    let [result] = await conn.query(sql, id);
    if (result[0].is_verified) {
      sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
      let [resultVerified] = await conn.query(sql, id);
      return res.status(200).send(resultVerified[0]);
    } else {
      return res.status(200).send(result[0]);
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

// Send Verification Email Controller

const emailVerification = async (req, res) => {
  const { id, username, email } = req.body;
  try {
    // data token to make unique token
    let createdAt = new Date().getTime();
    let dataToken = {
      id,
      username,
      createdAt,
    };

    let cached = myCache.set(id, dataToken, 300);
    if (!cached) {
      throw { message: "error caching" };
    }

    const tokenEmail = createJWTEmail(dataToken);
    const host =
      process.env.NODE_ENV === "production"
        ? "http://domainasli"
        : "http://localhost:3000";
    const link = `${host}/verification/${tokenEmail}`;

    // Pengiriman email verifikasi ke user saat sudah melakukan register
    let filepath = path.resolve(
      __dirname,
      "../templates/templateEmailHTML.html"
    );

    let htmlString = fs.readFileSync(filepath, "utf-8");
    const template = handlebars.compile(htmlString);
    const htmlToEmail = template({ username, link });

    // Pengiriman email
    await transporter.sendMail({
      from: "TheChefBook <lbrqspurs@gmail.com>",
      to: email,
      subject: "TheChefBook Account Verification E-mail",
      html: htmlToEmail,
    });
    return res
      .status(200)
      .send({ message: "e-mail verification has been sent" });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

// Verify Account
const verifyAccount = async (req, res) => {
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    // pengecekan apabila user telah terverifikasi atau belum
    sql = `SELECT id FROM users WHERE id = ? AND is_verified = 1`;
    let [userVerified] = await conn.query(sql, id);
    if (userVerified.length) {
      throw { message: "Your account has already verified" };
    }
    // apabila user belum verifikasi
    sql = `UPDATE users SET ? WHERE id =?`;
    let verificationData = {
      is_verified: 1,
    };
    await conn.query(sql, [verificationData, id]);
    sql = `INSERT INTO user_details SET user_id = ?`;
    await conn.query(sql, id);
    sql = `SELECT id, username, email, is_verified FROM users WHERE id = ?`;
    let [userLogIn] = await conn.query(sql, id);
    await conn.commit();
    conn.release();
    return res.status(200).send(userLogIn[0]);
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `SELECT * FROM users WHERE email = ?`;
    let [requestedUser] = await conn.query(sql, email);

    if (!requestedUser.length) {
      throw { message: "There is no account registered with that email." };
    }

    const { id, username } = requestedUser[0];
    let createdAt = new Date().getTime();
    const dataToken = {
      id,
      username,
      createdAt,
    };

    let cached = myCache.set(id, dataToken, 300);
    if (!cached) {
      throw { message: "error while doing caching." };
    }
    // Variable host untuk pemilihan host mana yang dipakai tergantung pada node_env
    const tokenEmail = createJWTEmail(dataToken);
    const host =
      process.env.NODE_ENV === "production"
        ? "http://domainasli"
        : "http://localhost:3000";
    const link = `${host}/reset-password/${tokenEmail}`;

    // Pengiriman email verifikasi ke user saat sudah melakukan register
    let filepath = path.resolve(
      __dirname,
      "../templates/templateResetHTML.html"
    );

    let htmlString = fs.readFileSync(filepath, "utf-8");
    const template = handlebars.compile(htmlString);
    const htmlToEmail = template({ username, link });

    // Pengiriman email
    await transporter.sendMail({
      from: "TheChefBook <lbrqspurs@gmail.com>",
      to: email,
      subject: "TheChefBook Password Reset E-mail",
      html: htmlToEmail,
    });
    conn.release();
    return res.status(200).send({ message: "Email sent!" });
  } catch (error) {
    conn.release();
    return res.status(500).send({ message: error.message || error });
  }
};

const tokenPassword = async (req, res) => {
  try {
    return res.status(200).send({ message: "Password changed!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
const changePassword = async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;

  let sql, conn;

  try {
    conn = await dbCon.promise().getConnection();

    let updateData = {
      password: await hashRegister(password),
    };
    sql = `UPDATE users SET ? WHERE id = ?`;
    await conn.query(sql, [updateData, id]);

    conn.release();
    return res.status(200).send({ message: "Password changed!" });
  } catch (error) {
    conn.release();
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  tokenPassword,
  changePassword,
  forgotPassword,
  registerController,
  loginController,
  keepLogin,
  emailVerification,
  verifyAccount,
};
