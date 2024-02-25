const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  updateArticleVotes,
  postArticle,
} = require("../controllers/articles.controller");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
