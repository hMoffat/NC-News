const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;    
    `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
    });
};

exports.addCommentVotes = (comment_id, votes) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
