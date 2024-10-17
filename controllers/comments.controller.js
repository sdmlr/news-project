const { checkIfArticleExist } = require("../models/articles.model");
const { deleteCommentById, fetchCommentsByArticle, insertComment } = require("../models/comments.model")


exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params
    const regex = /^\d+$/;

    if (!regex.test(article_id)) {
        return next({ status: 400, msg: "Invalid ID Format" })
    }

    checkIfArticleExist(article_id)
    .then((articleExist) => {
        if (!articleExist) {
            return Promise.reject({ status: 404, msg: 'Article Not Found'})
        }
        return fetchCommentsByArticle(article_id)
    })
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch((err) => {
            next(err);
        });
};



exports.addComment = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body

    if (isNaN(article_id)) {
        return next({ status: 400, msg: 'Invalid ID Format'})
    }
    if (!username || !body) {
        return next({ status: 400, msg:'Bad Request' })
    }

    insertComment(article_id, username, body)
        .then((newComment) => {
            res.status(201).send({ comment: newComment})
        })
        .catch((err) => {
            if (err.code === '23503') {
                return next({ status: 404, msg: 'Article or user not found'})
            }
            next(err);
        })
}

exports.removeComment = (req, res, next) => {
    const { comment_id } = req.params;

    deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => {            
            next(err);
        })
}