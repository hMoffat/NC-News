const endpointsRouter = require("express").Router();
const { getEndpoints } = require("../controllers/endpoints.controller");

endpointsRouter.route("/").get(getEndpoints);

module.exports = endpointsRouter;
