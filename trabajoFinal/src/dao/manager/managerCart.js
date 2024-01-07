import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCarts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const cart = JSON.parse(data);
      return cart;
    } else {
      return [];
    }
  };

  getCartId = async (idCart) => {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === idCart);
    if (!cart) {
      throw new Error(`The cart id : ${idCart} not exists`);
    }
    return cart;
  };

  addNewCart = async (cart) => {
    let carts = await this.getCarts();

    cart.products = [];
    cart.id = carts.length + 1;

    carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
  };

  addProductInCart = async (idCart, idProd) => {
    let carts = await this.getCarts();
    let cart = await this.getCartId(idCart);
    let prodExists = false;
    if (!cart) {
      throw new Error(`The cart id : ${idCart} not exists`);
    }

    cart.id= idCart;
    cart.products.forEach(prod => {
        console.log(prod)
        if (prod.product == idProd) {
            prod.quantity ++;
            prodExists = true;
        }
    });
    if (!prodExists) {
        cart.products.push({"product" : idProd,"quantity" : 1});
    }

    carts[idCart -1 ] = cart;
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
    return `Ok add product to cart`

  };
}
