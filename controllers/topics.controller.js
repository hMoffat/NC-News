const { fetchTopics } = require("../models/topics.model");

exports.getTopics = (req, res) => {
  fetchTopics().then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
};
