const { fetchArticleById, fetchArticles } = require('../models/articles.model')

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then(result => {
            if (result.rows.length === 0) {
                return Promise.reject({ msg: "No articles found"})
            }
            res.status(200).send(result.rows)
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ msg: 'Internal Server Error' });
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