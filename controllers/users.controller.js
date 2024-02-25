const {
  fetchUsers,
  fetchUserByUsername,
  fetchUserComments,
} = require("../models/users.model");

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
  fetchUserComments(username)
    .then((userComments) => {
      res.status(200).send({ userComments });
    })
    .catch((err) => {
      next(err);
    });
};
