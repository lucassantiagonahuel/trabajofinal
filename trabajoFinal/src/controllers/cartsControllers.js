import __dirname from "../utils/utils.js";
import cartsService from "../service/cartsService.js";
import ticketService from "../service/ticketService.js";
import productsService from "../service/productsService.js";

const getCartById = async (req, res) => {
  try {
    const idCart = req.params.cid;
    let response = await cartsService.getCartById(idCart);
    res.send({ products: response.products });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createCart = async (req, res) => {
  try {
    const response = await cartsService.addNewCart(req.body);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addProductInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const product = await productsService.getProductById(prodId);
    const userId = req.user.user._id;
    const userRole = req.user.user.role;
    const response = await cartsService.addProductInCart(
      cartId,
      prodId,
      product,
      userId,
      userRole
    );

    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProductInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const response = await cartsService.deleteProductInCart(cartId, prodId);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;
    const response = await cartsService.updateCart(cartId, products);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateQuantityProductInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const { quantity } = req.body;
    const response = await cartsService.updateQuantityProduct(
      cartId,
      prodId,
      quantity
    );
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const response = await cartsService.deleteAllProductsInCart(cartId);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const purchaseCompleted = async (req, res) => {
  const cartId = req.params.cid;
  let createTicket;
  let { products } = await cartsService.getCartById(cartId);
  const { ticketProducts, productsReject, totalPrice } =
    await cartsService.purchaseCompleted(products, cartId);

  if (ticketProducts && ticketProducts.length > 0) {
    createTicket = await ticketService.createNewTicket(
      req.user.email,
      totalPrice
    );
  }
  if (productsReject && productsReject.length > 0) {
    let parseProducts = productsReject.map((item) => item.product);

    await cartsService.updateCart(cartId, parseProducts);
  } else {
    await cartsService.deleteAllProductsInCart(cartId);
  }

  const response = {
    ticket: createTicket,
    rejectedProductIds: productsReject.map((item) => item.product._id),
  };

  res.send(response);
};

export default {
  getCartById,
  createCart,
  addProductInCart,
  deleteProductInCart,
  updateCart,
  updateQuantityProductInCart,
  deleteCart,
  purchaseCompleted,
};
