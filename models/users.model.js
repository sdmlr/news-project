const db = require("../db/connection");

exports.fetchUsers = () => {
  const queryStr = "SELECT username, name, avatar_url FROM users;";

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
