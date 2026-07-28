const express = require("express");
const app = express();
const path = require("node:path");
const signUpController = require("./controllers/sign-up-controller");
const passport = require("./config/passport").passport;
const session = require("express-session");
require("dotenv").config();

const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`Server is listening on Port:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome!</h1>");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/login", (req, res) => {
  //Call controller to render loginpage
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("<h1>You logged in!</h1>");
  //Call controller to redirect to homepage
});

app.post("/sign-up", signUpController.signUpUser);

module.exports = { app };
