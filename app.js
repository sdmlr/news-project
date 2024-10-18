const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getApiDocs } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
  updateArticle,
} = require("./controllers/articles.controller");
const {
  removeComment,
  getCommentsByArticle,
  addComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api", getApiDocs);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", removeComment);

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
