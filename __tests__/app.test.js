const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection')

beforeEach(() => seed(data));
afterAll(() => db.end());


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