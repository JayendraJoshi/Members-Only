const express = require("express");
const app = express();
const path = require("node:path");
const signUpController = require("./controllers/sign-up-controller");
const membershipController = require("./controllers/membership-controller");
const messageController = require("./controllers/message-controller");
const passport = require("./config/passport").passport;
const authenticateUser = require("./config/passport").authenticateUser;
const session = require("express-session");
require("dotenv").config();

const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
app.use((req, res, next) => {
  req.session.membershipAccess ||= { member: false, admin: false };
  res.locals.currentUser = req.user;
  res.locals.membershipAccess = req.session.membershipAccess;
  next();
});

app.get("/", messageController.renderIndexPage);

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/login", (req, res) => {
  res.render("login", { failedLogin: req.query.failed === "1" });
});

app.get(
  "/membership",
  authenticateUser,
  membershipController.renderMembershipPage,
);

app.post("/", messageController.addMessage);

app.post(
  "/login",
  passport.authenticate("local", {
    session: true,
    failureRedirect: "/login?failed=1",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

app.post("/logout", async (req, res, next) => {
  req.logout((error) => {
    if (error) next(error);
    res.redirect("/");
  });
});

app.post(
  "/membership/member/status",
  authenticateUser,
  membershipController.enableMemberAccess,
);

app.post(
  "/membership/admin/status",
  authenticateUser,
  membershipController.enableAdminAccess,
);

app.post("/membership/member/change", membershipController.toggleMemberStatus);
app.post("/membership/admin/change", membershipController.toggleAdminStatus);

app.post("/sign-up", signUpController.signUpUser);

app.post("/message/delete/:id", messageController.deleteMessage);

app.listen(PORT, () => {
  console.log(`Server is listening on Port:${PORT}`);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error");
});

module.exports = { app };
