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
    test("None existant path on api/aricles/:artcle_id", () => {
      return request(app)
        .get("/api/aricles/10")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path does not exist");
        });
    });
    test("None existant path on api/aricles/", () => {
      return request(app)
        .get("/api/aricles")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path does not exist");
        });
    });
  });
});

describe("Bad request", () => {
  describe("Status 400: Responds with 'Bad request' message, for:", () => {
    test("Invalid id on GET api/articles/:article_id", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
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
        .get("/api/articles/4")
        .expect(200)
        .then(({ body }) => {
          //check id
          expect(body.article_id).toBe(4);
          //rest
          expect(body).toHaveProperty("author", expect.any(String));
          expect(body).toHaveProperty("title", expect.any(String));
          expect(body).toHaveProperty("body", expect.any(String));
          expect(body).toHaveProperty("topic", expect.any(String));
          expect(body).toHaveProperty("created_at", expect.any(String));
          expect(body).toHaveProperty("votes", expect.any(Number));
          expect(body).toHaveProperty("article_img_url", expect.any(String));
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
  });
  describe("GET api/articles", () => {
    test("Status 200: responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(13);
          expect(body).toBeSortedBy("created_at");
          const article_id1 = body.find((article) => article.article_id === 1);
          expect(article_id1).toHaveProperty("comment_count", "11");

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
});
