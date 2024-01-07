import fs from "fs";
import { urlCreator } from "../../utils/utils.js";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async (limit = 0) => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const product = JSON.parse(data);
      if (limit != 0) {
        const productsLimit = product.slice(0, limit);
        return productsLimit;
      }
      return product;
    } else {
      return [];
    }
  };

  getProductById = async (idProduct) => {
    const product = await this.getProducts();
    let productExist = product.find((prod) => prod.id === +idProduct);
    if (!productExist) {
      throw new Error(`The product id : ${idProduct} does not exist`);
    }
    return productExist;
  };

  addProduct = async (
    {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status = true,
      category,
    },
    imagesFiles
  ) => {
    const products = await this.getProducts();

    const product = {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    };

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !status ||
      !category ||
      stock === null ||
      stock === undefined
    ) {
      throw new Error("Error: All fields are required.");
    }

    let codeExist = products.findIndex((cod) => cod.code === code);

    if (codeExist !== -1) {
      throw new Error(
        `Error in code ${product.code} the product already exists`
      );
    }

    const urlsCreated = urlCreator(imagesFiles);
    product.id = products.length + 1;
    product.price = +product.price;
    product.stock = +product.stock;
    product.thumbnails = urlsCreated;

    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return product;
  };

  updateProduct = async (idProd, prodUpgrade, imagesFiles) => {
    let products = await this.getProducts();
    const product = products.find((prod) => prod.id === +idProd);
    const urlsCreated = urlCreator(imagesFiles);

    if (!product) {
      return `Product update id : ${idProd} not exists`;
    }

    product.title = prodUpgrade.title;
    product.description = prodUpgrade.description;
    product.price = +prodUpgrade.price;
    product.thumbnails = urlsCreated;
    product.code = prodUpgrade.code;
    product.stock = +prodUpgrade.stock;
    product.category = prodUpgrade.category;
    product.status = prodUpgrade.status;

    prodUpgrade.id = idProd;
    products[idProd - 1] = product;

    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return `El producto id : ${idProd} fue modificado con exito!`;
  };

  deleteProduct = async (idProd) => {
    let products = await this.getProducts();
    const product = products.find((prod) => prod.id === +idProd);
    if (!product) {
      return `Product delete id : ${idProd} not exists`;
    }

    const productsFilter = products.filter((product) => product.id !== idProd);

    await fs.promises.writeFile(this.path, JSON.stringify(productsFilter));

    return `El producto id : ${idProd} fue eliminado con exito!`;
  };
}
