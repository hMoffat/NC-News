const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");

app.get("/api/topics", getTopics);

//end of http requests
app.all("*", (req, res) => {
  res.status(404).send({ message: "Path does not exist" });
});

//end of middleware error handling
app.use((err, req, res, next) => {
  console.log("Error: ", err);
  res.status(500).send({ message: "Server Error: something went wrong." });
});

module.exports = app;
