const db = require("../db/connection");

exports.fetchArticleById = (article_id, next) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.votes, articles.article_img_url, articles.created_at, COUNT(comments.article_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY comments.article_id, articles.article_id, articles.*
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id= $1 ORDER BY created_at ASC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments
    (body, article_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      if (rows[0].body.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Missing comment body",
        });
      }
      return rows[0];
    });
};
