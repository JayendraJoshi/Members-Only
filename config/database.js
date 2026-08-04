const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const insertUser = async (firstname, lastname, username, password) => {
  const query = `INSERT INTO users (firstname, lastname, username, password)
  VALUES($1,$2,$3,$4) RETURNING *;`;
  const { rows } = await pool.query(query, [
    firstname,
    lastname,
    username,
    password,
  ]);
  return rows[0];
};

const selectUsername = async (user_id) => {
  const query = `SELECT username FROM users WHERE id = $1;`;
  const { rows } = await pool.query(query, [user_id]);
  return rows[0];
};

const setIsMemberTrue = async (user_id) => {
  const query = `UPDATE users SET ismember = true WHERE id = $1;`;
  await pool.query(query, [user_id]);
};

const setIsMemberFalse = async (user_id) => {
  const query = `UPDATE users SET ismember = false WHERE id = $1;`;
  await pool.query(query, [user_id]);
};

const setIsAdminTrue = async (user_id) => {
  const query = `UPDATE users SET isadmin = true WHERE id = $1;`;
  await pool.query(query, [user_id]);
};

const setIsAdminFalse = async (user_id) => {
  const query = `UPDATE users SET isadmin = false WHERE id = $1;`;
  await pool.query(query, [user_id]);
};

const insertMessage = async (title, text, user_id) => {
  const query = `INSERT INTO messages (title, text, timestamp, user_id)
  VALUES ($1,$2,CURRENT_TIMESTAMP,$3);`;
  await pool.query(query, [title, text, user_id]);
};

const selectAllMessages = async () => {
  const result = await pool.query(`SELECT * FROM messages;`);
  return result.rows;
};

const deleteMessage = async (message_id) => {
  const query = `DELETE FROM messages WHERE id = $1;`;
  await pool.query(query, [message_id]);
};

module.exports = {
  insertUser,
  pool,
  insertMessage,
  selectAllMessages,
  setIsMemberTrue,
  setIsMemberFalse,
  setIsAdminTrue,
  setIsAdminFalse,
  deleteMessage,
  selectUsername,
};
