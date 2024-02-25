const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  getUserComments,
} = require("../controllers/users.controller");

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUserByUsername);

usersRouter.route("/:username/comments").get(getUserComments);

module.exports = usersRouter;
