const { removeComment, addCommentVotes } = require("../models/comments.model");
const { checkCommentIdExists } = require("../utils/utils");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const addCommentVotesQuery = addCommentVotes(comment_id, inc_votes);
  const commentIdCheck = checkCommentIdExists(comment_id);
  Promise.all([addCommentVotesQuery, commentIdCheck])
    .then((results) => {
      const updatedComment = results[0];
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
