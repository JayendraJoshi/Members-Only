const express = require("express");
const app = express();
const path = require("node:path");
const signUpController = require("./controllers/sign-up-controller");
const memberShipController = require("./controllers/membership-controller");
const passport = require("./config/passport").passport;
const authenticateUser = require("./config/passport").authenticateUser;
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
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("<h1>Welcome!</h1>");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/login", (req, res) => {
  //Call controller to render loginpage
  res.render("login");
});

app.get("/become-a-member", authenticateUser, (req, res) => {
  res.render("become-a-member");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", session: true }),
  (req, res) => {
    res.send("<h1>You logged in!</h1>");
    console.log(req.user);
    //Call controller to redirect to homepage
  },
);

app.post(
  "/become-a-member",
  authenticateUser,
  memberShipController.giveUserMembership,
);

app.post("/sign-up", signUpController.signUpUser);

app.listen(PORT, () => {
  console.log(`Server is listening on Port:${PORT}`);
});

module.exports = { app };
