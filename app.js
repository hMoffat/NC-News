const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/articles.controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

//end of http requests
app.all("*", (req, res) => {
  res.status(404).send({ message: "Path does not exist" });
});

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code)) {
    console.log("psql error -->", err);
    res.status(400).send({ message: "Bad request" });
  }
  if (err.message) {
    const { status, message } = err;
    res.status(status).send({ message });
  } else {
    next(err);
  }
});

//end of middleware error handling
app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ message: "Server Error: something went wrong.", error: err });
});

module.exports = app;
