const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { getUsers } = require("./controllers/users.controller");

app.use(express.json());

app.use("/api", apiRouter);

//end of http requests
app.all("*", (req, res) => {
  res.status(404).send({ message: "Path does not exist" });
});

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02", "23502", "23503"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ message: "Bad request" });
  }
  if (err.message) {
    const { status, message } = err;
    res.status(status).send({ message });
  } else {
    next(err);
  }
});

//end of middleware error handling
app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ message: "Server Error: something went wrong.", error: err });
});

module.exports = app;
