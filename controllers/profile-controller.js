const db = require("../config/database");
const { body, validationResult, matchedData } = require("express-validator");
require("dotenv").config();

const validateMemberPassword = [
  body("password")
    .notEmpty()
    .withMessage("Password input can't be empty.")
    .custom((value, { req }) => {
      return value === process.env.MEMBER_PASSWORD;
    })
    .withMessage("Wrong password, please read the hint and try again."),
];

const validateAdminPassword = [
  body("password")
    .notEmpty()
    .withMessage("Input can't be empty.")
    .custom((value, { req }) => {
      return value === process.env.ADMIN_PASSWORD;
    })
    .withMessage("Wrong password, please try again."),
];

const enableMemberAccess = [
  validateMemberPassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(401)
        .render("profile", { errors: errors.array(), memberErrors: true });
    } else {
      req.session.profileAccess.member = true;
      return res.redirect("/profile");
    }
  },
];

const enableAdminAccess = [
  validateAdminPassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(401)
        .render("profile", { errors: errors.array(), adminErrors: true });
    } else {
      req.session.profileAccess.admin = true;
      return res.redirect("/profile");
    }
  },
];

const toggleMemberStatus = async (req, res, next) => {
  try {
    const checked = req.body.checked === "true";
    const user = req.user;
    if (checked) {
      await db.setIsMemberTrue(user.id);
      return res.status(200).json({ success: true });
    } else {
      await db.setIsMemberFalse(user.id);
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const toggleAdminStatus = async (req, res, next) => {
  try {
    const checked = req.body.checked === "true";
    if (checked) {
      await db.setIsAdminTrue(req.user.id);
      return res.status(200).json({ success: true });
    } else {
      await db.setIsAdminFalse(req.user.id);
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const renderProfilePage = async (req, res, next) => {
  const user = req.user;
  return res.render("profile", {
    memberStatus: user.ismember,
    adminStatus: user.isadmin,
  });
};

module.exports = {
  enableMemberAccess,
  enableAdminAccess,
  toggleMemberStatus,
  toggleAdminStatus,
  renderProfilePage,
};
