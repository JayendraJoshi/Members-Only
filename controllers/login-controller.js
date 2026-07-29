const db = require("../config/database");
const { body, validationResult, matchedData } = require("express-validator");

const renderLoginPage = async (req, res) => {
  res.render("login");
};
