const db = require("../config/database");
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");

const validateSignUpData = [
  body("password")
    .notEmpty()
    .withMessage("Password input can't be empty.")
    .isLength({ min: 5 })
    .withMessage("Password must be a minimum of 5 characters long."),
  body("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation input can't be empty.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match."),
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("Firstname input can't be empty")
    .isAlpha()
    .withMessage("Lastname can only contain alphabet letters.")
    .isLength({ max: 100 })
    .withMessage("firstname can't be longer than 100 characters"),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Lastname input can't be empty.")
    .isAlpha()
    .withMessage("Lastname can only contain alphabet letters.")
    .isLength({ max: 100 })
    .withMessage("firstname can't be longer than 100 characters"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username input can't be empty")
    .isLength({ max: 100 })
    .withMessage("firstname can't be longer than 100 characters"),
];

const signUpUser = [
  validateSignUpData,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).render("sign-up", {
        errors: errors.array(),
      });
    }
    const { firstname, lastname, username, password, passwordConfirmation } =
      matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await db.insertUser(
        firstname,
        lastname,
        username,
        hashedPassword,
        "Not a member",
      );
      res.status(200).send("<h1>User created!</h1>");
      //redirect to homepage
    } catch (error) {
      res.status(500).render("sign-up", { errors: [{ msg: error.message }] });
    }
  },
];

module.exports = { signUpUser };
