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
    test("Status 404: responds with 'Path does not exist' message", () => {
      return request(app)
        .get("/api/topcs")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("Path does not exist");
        });
    });
  });
});
