const { fetchArticleById } = require('../models/articles.model')

exports.getArticleById = (req, res, next) => {
    console.log(req)
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then(result => {
            console.log(result.rows.length)
            if (result.rows.length === 0) {
                return res.status(404).send({ msg: 'Article not found' })
            }
            res.status(200).send(result.rows[0]);
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ msg: 'Internal Server Error' });
        });
};