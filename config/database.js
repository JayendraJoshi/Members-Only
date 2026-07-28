const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const insertUser = async (
  firstname,
  lastname,
  username,
  password,
  membershipStatus,
) => {
  const query = `INSERT INTO users (firstname, lastname, username, password, membership_status)
  VALUES($1,$2,$3,$4,$5);`;
  await pool.query(query, [
    firstname,
    lastname,
    username,
    password,
    membershipStatus,
  ]);
};

module.exports = { insertUser };
