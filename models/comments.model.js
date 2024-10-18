const db = require("../db/connection");

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

exports.insertComment = (article_id, username, body) => {
  const queryStr =
    "INSERT INTO comments (article_id, author, body, created_at, votes) VALUES ($1, $2, $3, NOW(), 0) RETURNING *;";

  return db.query(queryStr, [article_id, username, body]).then((result) => {
    return result.rows[0];
  });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return;
    });
};
