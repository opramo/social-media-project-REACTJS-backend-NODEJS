const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lbrqspurs@gmail.com",
    pass: "edkwevefckyuyhbs",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
