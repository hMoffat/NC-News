const { fetchArticleById } = require("../models/articles.model.js");

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      /// CHANGE THIS
      console.log(err);
    });
};
