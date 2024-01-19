const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentVotes,
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteCommentById);

module.exports = commentsRouter;
