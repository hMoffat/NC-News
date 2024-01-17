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
      ORDER BY articles.created_at;`
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
