const express = require('express')
const { getTopics } = require('./controllers/topics.controller')
const { getApiDocs } = require('./controllers/api.controller')
const { getArticleById, getArticles, getCommentsByArticle, addComment } = require('./controllers/articles.controller')

const app = express()

app.use(express.json())

app.get('/api', getApiDocs)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.post('/api/articles/:article_id/comments', addComment)

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        console.log('Server error', err)
        res.status(500).send({ msg: 'Internal Server Error'})
    }
})


app.all('*', (req,res, next) => {
    res.status(404).send({msg: 'Not found'});
})



module.exports = app;