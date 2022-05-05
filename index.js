const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const { dbCon } = require("./src/connection");
const { authRoutes, profileRoutes } = require("./src/routes");
const PORT = process.env.PORT;

// Morgan: Untuk memberikan date pada token (belajar lagi tentang moran)
morgan.token("date", (req, res) => {
  new Date().toString();
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

app.use(express.json());

app.use(cors({ exposedHeaders: ["x-token-access", "x-total-count"] }));

app.get("/", (req, res) => {
  res.send("<h1>API Self Project ready</h1>");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Auth Routes
app.use("/auth", authRoutes);

// Profile Routes
app.use("/profile", profileRoutes);

app.listen(PORT, () => console.log(`API running on ${PORT}`));
