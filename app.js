const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const signUpController = require("./controllers/sign-up-controller");

const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is listening on Port:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome!</h1>");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.post("/sign-up", signUpController.signUpUser);

module.exports = { app };
