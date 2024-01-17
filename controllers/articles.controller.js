const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  addArticleVotes,
} = require("../models/articles.model.js");
const { checkArticleIdExists } = require("../utils/utils.js");

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

exports.getArticles = (req, res) => {
  fetchArticles().then((rows) => {
    res.status(200).send(rows);
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articleIdCheck = checkArticleIdExists(article_id);
  const fetchComments = fetchCommentsByArticleId(article_id, next);
  Promise.all([fetchComments, articleIdCheck])
    .then((results) => {
      res.status(200).send({ comments: results[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  const articleIdCheck = checkArticleIdExists(article_id);
  const createComment = addComment(article_id, body);
  Promise.all([createComment, articleIdCheck])
    .then((results) => {
      res.status(201).send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const articleIdCheck = checkArticleIdExists(article_id);
  const increaseArticleVotes = addArticleVotes(article_id, inc_votes);
  Promise.all([increaseArticleVotes, articleIdCheck]).then((results) => {
    res.status(200).send(results[0]);
  });
};
