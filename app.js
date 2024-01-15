const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//end of http requests
app.all("*", (req, res) => {
  res.status(404).send({ message: "Path does not exist" });
});

//end of middleware error handling
app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ message: "Server Error: something went wrong.", error: err });
});

module.exports = app;
