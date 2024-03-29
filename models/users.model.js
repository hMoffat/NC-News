const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    });
};

exports.fetchUserComments = (username) => {
  return db
    .query(`SELECT * FROM comments WHERE author = $1 ORDER BY created_at`, [
      username,
    ])
    .then(({ rows }) => {
      return rows;
    });
};
