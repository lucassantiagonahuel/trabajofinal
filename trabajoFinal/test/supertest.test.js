import chai from "chai";
import chaiHttp from "chai-http";
import supertest from "supertest";

const expect = chai.expect;
chai.use(chaiHttp);
const requester = supertest("http://localhost:8080/api");

describe("Test de integracion de productos", () => {
  it("get a productos", async () => {
    const res = await requester.get("/products/");

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body.docs).to.be.an("array");
    expect(res.body.docs).to.have.length.above(0);
    expect(res.body).to.have.property("prevLink");
    expect(res.body).to.have.property("nextLink");
  });

  it("crea carrito", async () => {
    const res = await requester.post("/carts/").send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.have.property("_id");
    expect(res.body.products).to.be.an("array").that.is.empty;
  });
});
