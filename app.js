const express = require("express");
const apiRouter = require("./routers/api.router");

const app = express();

app.use(express.json());


app.use('/api', apiRouter)


app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID format" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Article or user not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
