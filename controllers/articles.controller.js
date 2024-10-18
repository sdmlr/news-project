const {
  fetchArticleById,
  fetchArticles,
  updateVotes,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query  

  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const regex = /^\d+$/;

  if (!regex.test(article_id)) {
    return res.status(400).send({ msg: "Invalid ID format" });
  }

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Invalid ID format" });
  }

  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Bad Request" });
  }

  updateVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
