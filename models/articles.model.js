const db = require("../db/connection");
const img =
  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";

exports.fetchArticleById = (article_id, next) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.votes, articles.article_img_url, articles.created_at, COUNT(comments.article_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY comments.article_id, articles.article_id, articles.*;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const queryValues = [];
  const columns = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!columns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: `Cannot sort by ${sort_by}`,
    });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, message: `Cannot order by ${order}` });
  }

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.votes, articles.article_img_url, articles.created_at, COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryValues.push(topic);
    sqlQuery += ` WHERE topic = $1`;
  }

  if (sort_by === "comment_count") {
    sqlQuery += ` GROUP BY comments.article_id, articles.article_id, articles.*
    ORDER BY ${sort_by} ${order};`;
  } else {
    sqlQuery += ` GROUP BY comments.article_id, articles.article_id, articles.*
    ORDER BY articles.${sort_by} ${order};`;
  }

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
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

exports.addArticleVotes = (article_id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.createArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `INSERT INTO articles
      (author, title, body, topic, article_img_url)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      const { article_id } = rows[0];
      return this.fetchArticleById(article_id);
    });
};
