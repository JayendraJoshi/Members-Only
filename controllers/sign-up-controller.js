const db = require("../config/database");
const { body, validationResult, matchedData } = require("express-validator");
const { hashPassword } = require("../libs/passwordUtils");

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
    .withMessage("Firstname input can't be empty.")
    .isAlpha(undefined, { ignore: " -'" })
    .withMessage("Firstname can only contain alphabet letters.")
    .isLength({ max: 100 })
    .withMessage("Firstname can't be longer than 100 characters."),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Lastname input can't be empty.")
    .isAlpha(undefined, { ignore: " -'" })
    .withMessage("Lastname can only contain alphabet letters.")
    .isLength({ max: 100 })
    .withMessage("Lastname can't be longer than 100 characters."),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username input can't be empty.")
    .isLength({ max: 100 })
    .withMessage("Username can't be longer than 100 characters."),
];

const signUpUser = [
  validateSignUpData,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", {
        errors: errors.array(),
      });
    }
    try {
      const { firstname, lastname, username, password } = matchedData(req);
      const hashedPassword = await hashPassword(password);
      const user = await db.insertUser(
        firstname,
        lastname,
        username,
        hashedPassword,
      );
      req.login(user, (error) => {
        if (error) return next(error);
        return res.status(200).redirect("/");
      });
    } catch (error) {
      console.error(error);
      return res.status(500).render("sign-up", {
        failedUserCreation: true,
      });
    }
  },
];

module.exports = { signUpUser };
