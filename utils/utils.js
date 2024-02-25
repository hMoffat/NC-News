const db = require("../db/connection");

exports.checkArticleIdExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Topic doesn't exist" });
      }
    });
};

exports.checkCommentIdExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
    });
};

exports.checkUserExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
    });
};
