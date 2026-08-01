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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    } else {
      const { title, text } = matchedData(req);
      const user = req.user;
      await db.insertMessage(title, text, user.id);
      return res.status(200).json({ success: true });
    }
  },
];

const renderIndexPage = async (req, res) => {
  try {
    const messages = await db.selectAllMessages();
    res.render("index", { messages: messages });
  } catch (error) {
    res.render("index", { messages: [], failedFetch: true });
    console.error(error);
  }
};

const deleteMessage = async (req, res) => {
  const message_id = req.params.id;
  await db.deleteMessage(message_id);
  res.status(200).redirect("/");
};

module.exports = { addMessage, renderIndexPage, deleteMessage };
