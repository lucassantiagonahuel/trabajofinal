import { cartModel } from "../models/cart.js";
import { ProductClass } from "../../dao/class/productsClass.js";
const productManager = new ProductClass();
import productsService from "../../service/productsService.js";
export class CartClass {
  constructor() {}
  getCartId = async (idCart) => {
    const cart = await cartModel.findById(idCart).populate("products.product");

    return cart;
  };

  addNewCart = async (cart) => {
    let carts = await cartModel.create(cart);
    return carts;
  };

  addProductInCart = async (idCart, cart) => {
    const response = await cartModel.updateOne({ _id: idCart }, cart);
    return response;
  };

  deleteProductInCart = async (idCart, cart) => {
    const response = cartModel.updateOne(
      { _id: idCart },
      { products: cart.products }
    );

    return response;
  };

  updateCart = async (idCart, cart) => {
    await this.addProductInCart(idCart, cart);

    return `Cart update ok`;
  };

  updateQuantityProduct = async (idCart, cart) => {
    const response = cartModel.updateOne({ _id: idCart }, cart);
    return response;
  };

  deleteAllProductsInCart = async (idCart,cart) => {
    const response = await cartModel.updateOne({ _id: idCart }, cart);
    return response;
  };
}
