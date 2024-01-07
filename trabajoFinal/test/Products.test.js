import mongoose from "mongoose";
import config from "../src/config/config.js";
import chai, { assert } from "chai";
import { ProductClass } from "../src/dao/class/productsClass.js";

let productClass = new ProductClass();
const expect = chai.expect;


describe("Testing Products", () => {
  before(async function () {
    await mongoose.connect(config.mongoUrlTest);
    await mongoose.connection.collections.products.drop();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("Se debe de crear un producto de manera correcta", async () => {
    let mockProduct = {
      title: "Cerveza",
      description: "Patagonia",
      price: 1500,
      code: "abc1234",
      stock: 540,
      status: true,
      category: "Bebidas",
    };
    const result = await productClass.addProduct(mockProduct);

    expect(result)
      .to.have.property("_id")
      .that.is.an.instanceOf(mongoose.Types.ObjectId);
    expect(result).to.include({
      title: "Cerveza",
      description: "Patagonia",
      price: 1500,
      code: "abc1234",
      stock: 540,
      status: true,
      category: "Bebidas",
    });
    expect(result).to.be.an("object").that.includes({
      title: "Cerveza",
      description: "Patagonia",
      price: 1500,
      code: "abc1234",
      stock: 540,
      status: true,
      category: "Bebidas",
      _id: result._id,
      __v: result.__v,
    });
  });

  it("El metodo get de la clase Products verificamos que sea un array y la cantiodad de documentos", async function () {
    const result = await productClass.getProducts();

    expect(result.docs).to.be.an("array");
    expect(result.totalDocs).to.be.a("number").and.to.be.at.least(0);
  });
});
