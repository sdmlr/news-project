const { fetchArticleById, fetchArticles, fetchCommentsByArticle, checkIfArticleEXist, insertComment } = require('../models/articles.model')

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then(articles => {
            res.status(200).send({ articles })
        })
        .catch(err => {
            next(err)
        })
}


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const regex = /^\d+$/;

    if (!regex.test(article_id)) {
        return res.status(400).send({ msg: 'Invalid ID format'})
    }


    fetchArticleById(article_id)
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).send({ msg: 'Article not found' })
            }
            res.status(200).send({ article: result.rows[0] });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ msg: 'Internal Server Error' });
        });
};


exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params
    const regex = /^\d+$/;

    if (!regex.test(article_id)) {
        return res.status(400).send({ msg: "Invalid ID Format"})
    }

    checkIfArticleEXist(article_id)
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
        return res.status(400).send({ msg: 'Invalid ID Format'})
    }
    if (!username || !body) {
        return res.status(400).send({ msg: 'Bad Request' })
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