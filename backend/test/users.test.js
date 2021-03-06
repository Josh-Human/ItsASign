/* eslint-env node, mocha */
/* eslint-disable */
require("dotenv").config({ path: `${__dirname}/.env.test` });
const mongoose = require("mongoose");
const { expect } = require("chai");
const should = require("chai").should();
const { have } = require("chai");
const request = require("supertest");
const req = require("express/lib/request");
const chai = require("chai");
const app = require("../app");

chai.use(require("chai-sorted"));
mongoose.Promise = global.Promise;

before(() => {
  const { DB_PASS } = process.env;
  const { URL } = process.env;
  const { DB_USER } = process.env;

  const options = {
    user: DB_USER,
    pass: DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(URL, options);
  mongoose.connection
    .once("open", () => {
      done();
    })
    .on("error", (error) => {
      console.warn("warning", error);
      done(error);
    });
});

after(() => {
  mongoose.disconnect();
});

describe("GET /api/users", () => {
  xit("200: returns list of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.should.be.a("array");
        users.should.be.lengthOf(12);
        users.forEach((user) => {
          expect(user).to.have.keys(
            "_id",
            "username",
            "picture",
            "name",
            "email",
            "password",
            "progress",
            "createdAt",
            "updatedAt"
          );
        });
      });
  });
});

describe("GET /api/users/:user_id", () => {
  xit("200: returns a specific user", () => {
    return request(app)
      .get("/api/users/Mejia")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).to.eql({
          _id: "61f2b4f082f0650a75fce302",
          createdAt: "1977-10-29T03:02:03.000Z",
          updatedAt: "1982-03-06T03:36:01.000Z",
          username: "Mejia",
          picture: "http://placehold.it/32x32",
          name: "Gertrude Hardin",
          email: "gertrudehardin@tellifly.com",
          password: -97145,
          progress: {
            completed_lessons: ["est", "elit"],
            total_xp: 124,
            badges: ["aute", "laborum", "sint"],
          },
        });
      });
  });

  it("400: handle a non-existent user", () => {
    return request(app)
      .get("/api/users/nonexistentuser")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).to.eql("User does not exist");
      });
  });
});

describe("GET /api/users/:username/progress", () => {
  it("200: get object containing details of progress", () => {
    return request(app)
      .get("/api/users/Mejia/progress")
      .expect(200)
      .then(({ body: { progress } }) => {
        expect(progress).to.deep.equal({
          completed_lessons: ["est", "elit"],
          total_xp: 124,
          badges: ["aute", "laborum", "sint"],
        });
      });
  });
});

describe("PATCH /api/users/:username", () => {
  it("201: updates user email", () => {
    return request(app)
      .patch("/api/users/Knowles")
      .send({ email: "test@example.com" })
      .expect(201)
      .then(({ body: { updated } }) => {
        expect(updated).to.eql(1);
      });
  });

  it("201: updates user password", () => {
    return request(app)
      .patch("/api/users/Knowles")
      .send({ password: 444 })
      .expect(201)
      .then(({ body: { updated } }) => {
        expect(updated).to.eql(1);
      });
  });

  it("201: updates user progress", () => {
    return request(app)
      .patch("/api/users/Knowles")
      .send({
        progress: {
          completed_lessons: ["test-lesson-1", "test-lesson-2"],
          total_xp: 50,
          badges: ["test-badge-1", "test-badge-2"],
        },
      })
      .expect(201)
      .then(({ body: { updated } }) => {
        expect(updated).to.eql(1);
      });
  });
});

xdescribe("POST /api/users/signup", () => {
  it.only("201: posts a user to the database", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        username: "testpr2ogress",
        email: "testpr2ogress@gmail.com",
        password: "100h21k994",
        name: "Andy2441",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.eql({
          success: true,
          message: "Registration Success",
        });
      });
  });

  xit("200: gives error if email is already in use ", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        username: "ARkts",
        email: "gertrudehardin@tellifly.com",
        password: "1001994",
        name: "Andy",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.eql({
          success: false,
          error: true,
          message: "Email is already in use",
        });
      });
  });

  xit("hash and save", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        username: "AndyRobots1",
        email: "pratikmagarjj2FYY@gmail.com",
        password: "1001994",
        name: "Andy",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).to.eql({
          success: false,
          error: body.error,
          message: "AndyRobots1 is already in use",
        });
      });
  });
  xit("hashes password", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        username: "Sidd",
        email: "toyssuck@gmail.com",
        password: "1001a994",
        name: "siddrulles",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.eql({
          success: true,
          message: "Registration Success",
        });
      });
  });
});

describe("DELETE /api/users/:user_id", () => {
  xit("200: delete a user", () => {
    return request(app)
      .delete("/api/users/AndyRobots")
      .expect(200)
      .then(({ body: { deletedCount } }) => {
        expect(deletedCount).to.eql(1);
      });
  });
});

describe("GET /api/sign_in", () => {
  it("200: successful sign in", () => {
    const username = "CharlotteThompson";
    const password = "password1";
    return request(app)
      .get(`/api/sign_in/?username=${username}&password=${password}`)
      .expect(200)
      .then(({ body: { successful } }) => {
        expect(successful).to.eql(true);
      });
  });
  it("400: invalid username", () => {
    const username = 456789;
    const password = "password1";
    return request(app)
      .get(`/api/sign_in/?username=456789&password=${password}`)
      .expect(401)
      .then(({ body: { successful } }) => {
        expect(successful).to.eql(false);
      });
  });
  it("404: user doesn't exist", () => {
    const username = "hompson";
    const password = "password1";
    return request(app)
      .get(`/api/sign_in/?username=${username}&password=${password}`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).to.eql("User does not exist");
      });
  });
  it("400: invalid password", () => {
    const username = "CharlotteThompson";
    const password = "@@@@//@";
    return request(app)
      .get(`/api/sign_in/?username=${username}&password=${password}`)
      .expect(401)
      .then((res) => {
        expect(res.body.successful).to.eql(false);
      });
  });
  it("401: password does not match", () => {
    const username = "Sidd3";
    const password = "1001a9ff4";
    return request(app)
      .get(`/api/sign_in/?username=${username}&password=${password}`)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.eql("Wrong password");
      });
  });
});

describe("GET /api/ranked_users", () => {
  it.only("200: sorted array", () => {
    return request(app)
      .get(`/api/ranked_users`)
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.be.sorted({ descending: true });
      });
  });
});
