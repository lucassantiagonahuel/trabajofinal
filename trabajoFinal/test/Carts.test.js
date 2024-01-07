import mongoose from "mongoose";
import config from "../src/config/config.js";
import chai, { assert } from "chai";
import { CartClass } from "../src/dao/class/cartClass.js";
import { ProductClass } from "../src/dao/class/productsClass.js";

let productClass = new ProductClass();

let cartClass = new CartClass();
const expect = chai.expect;

describe("Testing Carts", () => {
  before(async function () {
    await mongoose.connect(config.mongoUrlTest);
    await mongoose.connection.collections.carts.drop();
    await mongoose.connection.collections.products.drop();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("Se debe de crear un carrito de manera correcta", async () => {
    const result = await cartClass.addNewCart();

    expect(result)
      .to.have.property("_id")
      .that.is.an.instanceOf(mongoose.Types.ObjectId);

    expect(result).to.have.property("products").that.is.an("array").and.to.be
      .empty;
  });

  it("Se debe agregar un producto al carrito", async function () {
    let mockProduct = {
      title: "Cerveza",
      description: "Patagonia",
      price: 1500,
      code: "abc12345",
      stock: 540,
      status: true,
      category: "Bebidas",
    };
    const cartResult = await cartClass.addNewCart();
    let getCart = await cartClass.getCartId(cartResult._id);

    getCart.products.push(mockProduct);

    const result = await cartClass.addProductInCart(getCart._id, getCart);

    expect(getCart.products).to.be.an("array").that.has.lengthOf(1);
    expect(result).to.have.property("acknowledged", true);
    expect(result).to.have.property("modifiedCount", 1);
  });
});
