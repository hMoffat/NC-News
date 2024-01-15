const { fetchEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res) => {
  const endpoints = fetchEndpoints();
  res.status(200).send(endpoints);
};
