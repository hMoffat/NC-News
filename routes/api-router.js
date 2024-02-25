const apiRouter = require("express").Router();
const endpointsRouter = require("./endpoints-router");
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

apiRouter.use("/", endpointsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
