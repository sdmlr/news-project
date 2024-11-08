const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count"
  ];
  const validOrders = ["asc", "desc"];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort column" });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id`;

  const queryParams = [];

  if (topic) {
    queryStr += ` WHERE a.topic = $1`;
    queryParams.push(topic);
  }

  queryStr += ` GROUP BY a.article_id ORDER BY ${sort_by} ${order.toUpperCase()};`;

  return db.query(queryStr, queryParams).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No articles found" });
    }
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  const queryStr = `
    SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.body, a.article_img_url,
      CAST(COUNT(c.comment_id) AS INT) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;`;

  return db.query(queryStr, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return result.rows[0];
  });
};

exports.checkIfArticleExist = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rowCount > 0;
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  const queryStr =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";

  return db.query(queryStr, [inc_votes, article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    }
    return result.rows[0];
  });
};
