import mongoose from "mongoose";
import chai from "chai";
import chaiHttp from "chai-http";
import supertest from "supertest";
import config from "../src/config/config.js";

chai.use(chaiHttp);
const expect = chai.expect;
const request = supertest("http://localhost:8080/api/sessions/");

describe("Testing User Registration and Login", () => {
  let randomEmail;

  before(async function () {
    await mongoose.connect(config.mongoUrlTest);
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("Register ok", async () => {
    randomEmail = generateRandomEmail();

    const mockUserData = {
      first_name: "TestName",
      last_name: "TestApe",
      email: randomEmail,
      age: 25,
      password: "password123",
      role: "user",
    };

    const response = await request.post("/register").send(mockUserData);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      status: "Success",
      message: "User registered ok",
    });
  });

  it("Login ok", async () => {
    const loginData = {
      email: randomEmail,
      password: "password123",
    };

    const res = await request.post("/login").send(loginData);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Logged in!");
    expect(res.headers).to.have.property("set-cookie");
  });

  it("Error en login", async () => {
    const res = await request.get("/faillogin");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("error", "Failed login");
  });
});

function generateRandomEmail() {
  const uniqueString = Math.random().toString(36).substring(7);
  return `user_${uniqueString}@example.com`;
}
