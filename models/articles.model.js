const db = require('../db/connection')

exports.fetchArticleById = (article_id) => {
    const queryStr = 'SELECT * FROM articles WHERE article_id = $1;'

    return db
        .query(queryStr, [article_id]);
};