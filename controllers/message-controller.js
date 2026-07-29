const db = require("../config/database");
const { body, validationResult, matchedData } = require("express-validator");

const validateMessage = [
  body("title")
    .notEmpty()
    .withMessage("Title can't be empty.")
    .isLength({ max: 20 })
    .withMessage("Title can't be longer than 20 characters."),
  body("text")
    .isLength({ max: 500 })
    .withMessage("Text can't be longer than 500 characters."),
];

const addMessage = [
  validateMessage,
  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    } else {
      return res.status(200).json({ success: true });
    }
  },
];

module.exports = { addMessage };
