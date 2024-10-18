const { checkIfArticleExist } = require("../models/articles.model");
const {
  deleteCommentById,
  fetchCommentsByArticle,
  insertComment,
} = require("../models/comments.model");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  
  checkIfArticleExist(article_id)
    .then((articleExist) => {
      if (!articleExist) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return fetchCommentsByArticle(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
