const db = require('../db/connection')

exports.fetchArticles = () => {
    return db.query('SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;')
}

exports.fetchArticleById = (article_id) => {
    const queryStr = 'SELECT * FROM articles WHERE article_id = $1;'

    return db
        .query(queryStr, [article_id]);
};