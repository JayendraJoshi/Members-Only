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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const { title, text } = matchedData(req);
        const user = req.user;
        await db.insertMessage(title, text, user.id);
        return res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  },
];

const renderIndexPage = async (req, res) => {
  try {
    const messages = await db.selectAllMessages();
    const messagesWithAuthor = await Promise.all(
      messages.map(async (message) => {
        const row = await db.selectUsername(message.user_id);
        message.author = row.username;
        return message;
      }),
    );

    res.render("index", { messages: messagesWithAuthor });
  } catch (error) {
    res.render("index", { messages: [], failedFetch: true });
    console.error(error);
  }
};

const deleteMessage = async (req, res) => {
  const message_id = req.params.id;
  try {
    await db.deleteMessage(Number(message_id));
    res.status(200).redirect("/");
  } catch (error) {
    const messages = await db.selectAllMessages();
    const messagesWithAuthor = await Promise.all(
      messages.map(async (message) => {
        const username = await db.selectUsername(message.user_id);
        message.author = username;
        return message;
      }),
    );
    console.error(error);
    return res.render("index", {
      failedDeletion: true,
      failedDeleteMessageId: Number(message_id),
      messages: messagesWithAuthor,
    });
  }
};

module.exports = { addMessage, renderIndexPage, deleteMessage };
