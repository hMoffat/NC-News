const { fetchArticleById } = require("../models/articles.model.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id, next)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
