const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/articles/:article_id', () => {
    test('GET: 200 - responds article object when a valid id is provided', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((result) => {
                expect(result.body.article).toHaveProperty('author');
                expect(result.body.article).toHaveProperty('title');
                expect(result.body.article).toHaveProperty('article_id', 1);
                expect(result.body.article).toHaveProperty('body');
                expect(result.body.article).toHaveProperty('topic');
                expect(result.body.article).toHaveProperty('created_at');
                expect(result.body.article).toHaveProperty('votes');
                expect(result.body.article).toHaveProperty('article_img_url');
            })
    })
    test('GET: 404 - error handling when not found', () => {
        return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then((result) => {
                expect(result.body.msg).toBe('Article not found');
            })
    })
    test('GET: 400 - error handling when invalid id format', () => {
        return request(app)
            .get('/api/articles/invalid-id')
            .expect(400)
            .then((result) => {
                expect(result.body.msg).toBe('Invalid ID format');
            })
    })
})

describe('/api/topics', () => {
    test('GET: 200 sends an array of topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((result) => {
                expect(result.body.topics).toBeInstanceOf(Array);
            })
    })
    test('GET: 200 each topic should have "slug" and "description" properties', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((result) => {
                const topics = result.body.topics;
                expect(topics.every(topic => 'slug' in topic && 'description' in topic)).toBe(true)
            })
    })
    test('GET: 404 when invalid route', () => {
        return request(app)
            .get('/api/not-a-topic')
            .expect(404)
            .then((result) => {
                expect(result.body.msg).toBe("Not found")
            })
    })
});

describe('/api', () => {
    test('GET: 200 responds with API documentation', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then((result) => {
                expect(result.body).toEqual(endpoints);
            })
    })
})