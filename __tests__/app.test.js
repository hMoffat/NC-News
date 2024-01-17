const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Bad path", () => {
  describe("Status 404: responds with 'Path does not exist' message, for: ", () => {
    test("None existant path on /api/topcs", () => {
      return request(app)
        .get("/api/topcs")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path does not exist");
        });
    });
  });
});

describe("/api", () => {
  describe("GET /api", () => {
    test("Status 200: responds with an object describing all available endpoints on the api.", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpointsJSON);
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("Status 200: responds with an array of topic objects containing the slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(topic).toHaveProperty("slug", expect.any(String));
          });
        });
    });
  });
});

describe("api/articles", () => {
  describe("GET api/articles/:article_id", () => {
    test("Status 200: responds with corresponding article object to requested id", () => {
      return request(app)
        .get("/api/articles/7")
        .expect(200)
        .then(({ body }) => {
          const article7 = {
            article_id: 7,
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            votes: 0,
            body: "I was hungry.",
            created_at: "2020-01-07T14:08:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(body).toMatchObject(article7);
        });
    });
    test("Status 404: Responds with 'Not found' message, for valid but non-existant id.", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found");
        });
    });
    test("Status 400: Responds with 'Bad request' message, for invalid id", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });
  describe("GET api/articles", () => {
    test("Status 200: responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(13);
          expect(body).toBeSortedBy("created_at", { descending: true });

          body.forEach((article) => {
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

            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("Status 200: Responds with an array of comment objects for corresponding article id", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body }) => {
          const articles = body.comments;
          console.log("TEST --->", articles);
          expect(articles.length).toBe(2);
          expect(articles).toBeSortedBy("created_at");
          articles.forEach((article) => {
            expect(article).toHaveProperty("comment_id", expect.any(Number));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article.article_id).toBe(9);
          });
        });
    });
    test("Status 200: Responds with 200 and an empty array when passed a valid Id that has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const articles = body.comments;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBe(0);
        });
    });
    test("Status 404: Responds with 'Not found' message, for valid but non-existant id.", () => {
      return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not found");
        });
    });
    test("Status 400: Responds with 'Bad request' message, for invalid id", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });
});
