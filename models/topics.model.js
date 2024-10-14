const db = require('../db/connection');

const fetchTopics = () => {
    const queryStr = 'SELECT * FROM topics;'

    return db
        .query(queryStr)
        .then((result) => {
            return result.rows;
        })
}

module.exports = { fetchTopics }