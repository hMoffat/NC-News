const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  addArticleVotes,
} = require("../models/articles.model.js");
const { fetchTopics } = require("../models/topics.model.js");
const { checkArticleIdExists, checkTopicExists } = require("../utils/utils.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id, next)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const fetchArticlesQuery = fetchArticles(topic);
  const queries = [fetchArticlesQuery];

  if (topic) {
    const topicExistsQuery = checkTopicExists(topic);
    queries.push(topicExistsQuery);
  }

  Promise.all(queries)
    .then((results) => {
      const articles = results[0];
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articleIdCheck = checkArticleIdExists(article_id);
  const fetchComments = fetchCommentsByArticleId(article_id, next);
  Promise.all([fetchComments, articleIdCheck])
    .then((results) => {
      const comments = results[0];
      res.status(200).send({ comments });
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
      const postedComment = results[0];
      res.status(201).send({ postedComment });
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
  Promise.all([increaseArticleVotes, articleIdCheck])
    .then((results) => {
      const updatedArticle = results[0];
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
