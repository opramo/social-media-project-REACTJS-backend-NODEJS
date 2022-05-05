const { dbCon } = require("../connection");
const { hashRegister } = require("../lib");
const { hashLogIn } = require("../lib/hashPass");

// REGISTER
const registerService = async (data) => {
  let conn, sql;
  let { username, email, password } = data;
  // TO DO:
  try {
    //   buat connection dari pool menggunakan getConnection karena query lebih dari 1 kali, jangan lupa di-release di akhir  connection
    conn = await dbCon.promise().getConnection();
    // 1. (optional) cek validasi username tidak ada spasi
    let spasi = new RegExp(/ /g);
    if (spasi.test(username)) {
      console.log(`masuk sini`);
      throw { message: `Please avoid using space character` };
    }
    // 2. cek username & email sudah terdaftar atau belom
    let messageError = [];
    sql = `SELECT id from users WHERE username = ?`;
    let [resultUsername] = await conn.query(sql, username);
    if (resultUsername.length) {
      messageError[0] = "Username has already been used!";
    }
    sql = `SELECT id from users WHERE email = ?`;
    let [resultEmail] = await conn.query(sql, email);
    if (resultEmail.length) {
      messageError[1] = "Email has already been used!";
    }
    // 3. kalo ada, throw error

    if (resultUsername.length || resultEmail.length) {
      throw { message: messageError };
    }

    // 4. kalo ga ada, insert data register ke database
    // sebelum disimpan di database, password dihash terlebih dahulu
    // 5. berikan is_verified 0 by default
    sql = `INSERT INTO users set ?`;
    let insertData = {
      username,
      email,
      password: await hashRegister(password),
    };
    console.log("Data dari register user:", insertData);
    let [result] = await conn.query(sql, insertData);
    // 7. (optional) langsung log in, get data user
    sql = `SELECT * from users where id = ?`;
    let [userData] = await conn.query(sql, [result.insertId]);
    conn.release();
    console.log(`authservice sukses`, userData[0]);
    return { success: true, data: userData[0] };
  } catch (error) {
    conn.release();
    console.log(error);
    throw new Error(error.message || error);
  }
};

// LOG IN
const loginService = async (data) => {
  let conn, sql;
  let { username, email, password } = data;
  try {
    console.log("masuk service");
    conn = await dbCon.promise().getConnection();
    // Cek apakah username/email ada di dalam database
    sql = `SELECT * FROM users WHERE username = ? or email = ?`;
    let [result] = await conn.query(sql, [username, email]);
    console.log(result);
    let messageError = [];
    if (!result.length) {
      console.log(`tidak ada user`);
      messageError[0] = "Username or Email does not exist!";
      throw { message: messageError };
    }
    // Cek apakah password sesuai
    let hashedPassword = result[0].password;
    console.log(hashedPassword);
    let match = await hashLogIn(password, hashedPassword);
    console.log(match);
    if (!match) {
      console.log(`masuk sini karena tidak sama`);
      messageError[1] = "Incorrect password!";
      throw { message: messageError };
    }
    console.log(`berhasil`);
    if (result[0].is_verified) {
      sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
      console.log("result :", result[0]);
      let [resultVerified] = await conn.query(sql, result[0].id);
      console.log(`resultverified:`, resultVerified);
      conn.release();
      console.log("verhasil nichh");
      return { data: resultVerified[0] };
    } else {
      console.log("gagal nichh");
      conn.release();
      return { data: result[0] };
    }
  } catch (error) {
    conn.release();
    console.log(error);
    throw new Error(error.message || error);
  }
};

module.exports = { registerService, loginService };
