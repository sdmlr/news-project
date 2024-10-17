const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;"
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No articles found" });
      }
      return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  const queryStr = "SELECT * FROM articles WHERE article_id = $1;";

  return db.query(queryStr, [article_id]);
};

exports.fetchCommentsByArticle = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_AT DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.checkIfArticleEXist = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rowCount > 0;
    });
};

exports.insertComment = (article_id, username, body) => {
  const queryStr =
    "INSERT INTO comments (article_id, author, body, created_at, votes) VALUES ($1, $2, $3, NOW(), 0) RETURNING *;";

  return db
    .query(queryStr, [article_id, username, body])
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  const queryStr = 'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;'

  return db
    .query(queryStr, [inc_votes, article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found"})
      }      
      return result.rows[0]
    })
}
