const {
  fetchUsers,
  fetchUserByUsername,
  fetchUserComments,
} = require("../models/users.model");
const { checkUserExists } = require("../utils/utils");

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserComments = (req, res, next) => {
  const { username } = req.params;
  const userCheck = checkUserExists(username);
  const fetchComments = fetchUserComments(username);
  Promise.all([fetchComments, userCheck])
    .then((results) => {
      const userComments = results[0];
      res.status(200).send({ userComments });
    })
    .catch((err) => {
      next(err);
    });
};
