import __dirname from "../utils/utils.js";
import { CartManager } from "../dao/manager/managerCart.js";
import { CartClass } from "../dao/class/cartClass.js";
import { ProductClass } from "../dao/class/productsClass.js";
import productsService from "./productsService.js";
const productManager = new ProductClass();

const dbFolderPath = __dirname + "/../db";
const cartsPath = dbFolderPath + "/carrito.json";

let testCart = new CartManager(cartsPath);
let cartClass = new CartClass();
let productMain = cartClass;

const getCartById = async (idCart) => {
  const cart = await productMain.getCartId(idCart);
  if (!cart) {
    throw new Error(`The cart id : ${idCart} not exists`);
  }
  return cart;
};

const addNewCart = async (cart) => {
  const response = await productMain.addNewCart(cart);
  return response;
};

const addProductInCart = async (cartId, prodId, product, userId, userRole) => {
  let cart = await productMain.getCartId(cartId);
  let prodExists = false;
  if (!cart) {
    throw new Error(`The cart id : ${cartId} not exists`);
  }
  if (userRole === "premium" && product.owner == userId) {
    throw new Error(`Error added product in cart, user is owner for product`);
  }
  cart.products.forEach((prod) => {
    if (prod.product._id.toString() == prodId) {
      prod.quantity++;
      prodExists = true;
    }
  });
  if (!prodExists) {
    cart.products.push({ product: prodId, quantity: 1 });
  }
  const response = await productMain.addProductInCart(cartId, cart);
  return response;
};

const deleteProductInCart = async (cartId, prodId) => {
  let cart = await productMain.getCartId(cartId);

  if (!cart) {
    throw new Error(`The cart id : ${cartId} not exists`);
  }
  const productIndex = cart.products.findIndex(
    (prod) => prod.product._id.toString() === prodId
  );

  if (productIndex === -1) {
    throw new Error(`The product id : ${prodId} not exists in cart`);
  }

  cart.products.splice(productIndex, 1);

  const response = await productMain.deleteProductInCart(cartId, cart);
  return response;
};

const updateCart = async (cartId, products) => {
  let cart = await productMain.getCartId(cartId);
  if (!cart) {
    throw new Error(`The cart id : ${cartId} not exists`);
  }

  for (const product of products) {
    const prodExist = await productManager.getProductById(product.id);

    if (!prodExist) {
      throw new Error(`The product id : ${product._id} not exists`);
    }
    cart.products = [];
    cart.products.push({ product: product.id, quantity: 1 });
  }

  const response = await productMain.updateCart(cartId, cart);
  return response;
};

const updateQuantityProduct = async (cartId, prodId, quantity) => {
  let cart = await productMain.getCartId(cartId);
  let prodExists = false;
  if (!cart) {
    throw new Error(`The cart id : ${cartId} not exists`);
  }

  cart.products.forEach((prod) => {
    if (prod.product._id.toString() == prodId) {
      prod.quantity = quantity;
      prodExists = true;
    }
  });
  if (!prodExists) {
    cart.products.push({ product: prodId, quantity: 1 });
  }
  const response = await productMain.updateQuantityProduct(cartId, cart);
  return response;
};

const deleteAllProductsInCart = async (idCart) => {
  let cart = await productMain.getCartId(idCart);
  if (!cart) {
    throw new Error(`The cart id : ${idCart} not exists`);
  }
  cart.products = [];
  const response = await productMain.deleteAllProductsInCart(idCart, cart);
  return response;
};

const purchaseCompleted = async (products) => {
  if (!products) {
    throw new Error(`The list of products is empty`);
  }
  let ticketProducts = [];
  let productsReject = [];
  let totalPrice = 0;

  for (const item of products) {
    const productDb = await productsService.getProductById(item.product._id);
    if (item.quantity <= productDb.stock) {
      ticketProducts.push(item);
      totalPrice = item.quantity * productDb.price;
      item.product.stock -= item.quantity;

      await productsService.updateProduct(item.product._id, item.product, []);
    } else {
      productsReject.push(item);
    }
  }
  return {
    ticketProducts,
    productsReject,
    totalPrice,
  };
};

export default {
  getCartById,
  addNewCart,
  addProductInCart,
  deleteProductInCart,
  updateCart,
  updateQuantityProduct,
  deleteAllProductsInCart,
  purchaseCompleted,
};
