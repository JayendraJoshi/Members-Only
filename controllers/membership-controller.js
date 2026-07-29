const db = require("../config/database");
const { body, validationResult, matchedData } = require("express-validator");
require("dotenv").config();

const validatePassword = [
  body("secretPassword")
    .notEmpty()
    .withMessage("Secret password input can't be empty.")
    .custom((value, { req }) => {
      return value === process.env.SECRET_PASSWORD;
    })
    .withMessage("Wrong password, please read the hint and try again"),
];

const giveUserMembership = [
  validatePassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).render("become-a-member", { errors: errors.array() });
    }
    const { secretPassword } = matchedData(req);
    console.log(req.user);
    await db.updateMembershipStatusToMember(req.user.id);
    res.send("<h1>You have become a member!</h1>");
  },
];

module.exports = { giveUserMembership };
