const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    test("DELETE: 204 - deletes the comment", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test('DELETE: 400 - responds with "Invalid ID format"', () => {
      return request(app)
        .delete("/api/comments/notAnId")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID format");
        });
    });
    test('DELETE: 404 - responds with "Comment not found" when deleting', () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment not found");
        });
    });
  });
});

describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    test("PATCH: 200 - update the votes and responds with updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article.votes).toBeGreaterThan(0);
          expect(article).toHaveProperty("article_id", 1);
        });
    });
    test('PATCH: 400 - "Bad request" for missing field', () => {
      return request(app)
        .patch("/api/articles/99")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test('PATCH: 404 - "Article Not Found"', () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 10 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article Not Found");
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("POST: 201 - post a new comment and its properties", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Fantastic!" })
        .expect(201)
        .then((response) => {
          expect(response.body.comment).toHaveProperty(
            "comment_id",
            expect.any(Number)
          );
          expect(response.body.comment).toHaveProperty(
            "author",
            "butter_bridge"
          );
          expect(response.body.comment).toHaveProperty("article_id", 1);
          expect(response.body.comment).toHaveProperty("body", "Fantastic!");
        });
    });
    test('POST: 400 - responds with "Invalid ID Format" for invalid article_id', () => {
      return request(app)
        .post("/api/articles/inval-id/comments")
        .send({ username: "butter_bridge", body: "Interesting!" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID format");
        });
    });
    test("POST: 400 - response with Bad Request when missing fields", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test('POST: 404 - response with "Article or user not found" for non-existent article_id', () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({ username: "butter_bridge", body: "GREAT JOB!!" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article or user not found");
        });
    });
  });
});

describe("GET", () => {
  describe("/api/users", () => {
    test("GET: 200 - responds with an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.users)).toBe(true);
          response.body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
    test('GET: 404 - responds with "Not found" when incorrect path', () => {
      return request(app)
        .get("/api/not-existent")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    test("GET: 200 - responds with an array of comments for the given article_id of which each comment should have the following properties:", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((result) => {
          expect(Array.isArray(result.body.comments)).toBe(true);
          result.body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", 1);
          });
        });
    });
    test("GET: 200 - responds with an empty array when no comments in the given article", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length).toBe(0);
        });
    });
    test("GET: 400 - responds with Bad Request for invalid article_id", () => {
      return request(app)
        .get("/api/articles/fakenews/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid ID format");
        });
    });
    test('GET: 404 - responds with "Not found" for a non existent article_id', () => {
      return request(app)
        .get("/api/articles/7777/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article Not Found");
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    test("GET: 200 - responds article object when a valid id is provided", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((result) => {
          expect(result.body.article).toHaveProperty("author");
          expect(result.body.article).toHaveProperty("title");
          expect(result.body.article).toHaveProperty("article_id", 1);
          expect(result.body.article).toHaveProperty("body");
          expect(result.body.article).toHaveProperty("topic");
          expect(result.body.article).toHaveProperty("created_at");
          expect(result.body.article).toHaveProperty("votes");
          expect(result.body.article).toHaveProperty("article_img_url");
        });
    });
    test("GET: 404 - error handling when not found", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Article not found");
        });
    });
    test("GET: 400 - error handling when invalid id format", () => {
      return request(app)
        .get("/api/articles/invalid-id")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Invalid ID format");
        });
    });
  });

  describe("/api/articles", () => {
    test("GET: 200 - responds with the article and properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe("object");
          expect(response.body.articles.length).toBe(13);
          response.body.articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(Number));
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    test("GET 404 when no articles found", () => {
      return db
        .query("DELETE FROM comments;")
        .then(() => db.query("DELETE FROM articles;"))
        .then(() => {
          return request(app)
            .get("/api/articles")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("No articles found");
            });
        });
    });
  });

  describe("/api/topics", () => {
    test("GET: 200 sends an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((result) => {
          expect(result.body.topics).toBeInstanceOf(Array);
        });
    });
    test('GET: 200 each topic should have "slug" and "description" properties', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((result) => {
          const topics = result.body.topics;
          expect(
            topics.every((topic) => "slug" in topic && "description" in topic)
          ).toBe(true);
        });
    });
    test("GET: 404 when invalid route", () => {
      return request(app)
        .get("/api/not-a-topic")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Not found");
        });
    });
  });

  describe("/api", () => {
    test("GET: 200 responds with API documentation", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((result) => {
          expect(result.body).toEqual(endpoints);
        });
    });
  });
});
