const db = require("../db/connection");

exports.fetchArticleById = (article_id, next) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchArticles = () => {
  return db.query(
    "SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at"
  );
};
