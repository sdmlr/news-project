const express = require("express");
const {
  getArticles,
  getArticleById,
  updateArticle,
} = require("../controllers/articles.controller");
const {
  getCommentsByArticle,
  addComment,
} = require("../controllers/comments.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", updateArticle);
articlesRouter.get("/:article_id/comments", getCommentsByArticle);
articlesRouter.post("/:article_id/comments", addComment);

module.exports = articlesRouter;
