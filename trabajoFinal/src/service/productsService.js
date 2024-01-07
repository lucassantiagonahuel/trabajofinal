import { ProductManager } from "../dao/manager/managerProducts.js";
import { ProductClass } from "../dao/class/productsClass.js";
import __dirname,{ urlCreator } from "../utils/utils.js";
import { generateProducts } from "../utils/mocks.js";

const dbFolderPath = __dirname + "/../db";
const productsPath = dbFolderPath + "/Products.json";

let productFileSystem = new ProductManager(productsPath);
let productClass = new ProductClass();
let productMain = productClass;

const getProducts = async (filters, sort, limit = 10, page = 1) => {
  const filter = {};

  if (filters) {
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        filter[key] = filters[key];
      }
    }
  }

  filter.stock = { $gt: 0 };

  const products = await productMain.getProducts(filter, sort, limit, page);

  products.prevLink = products.hasPrevPage
    ? `/products?limit=${limit}&page=${products.prevPage}`
    : null;
  products.nextLink = products.hasNextPage
    ? `/products?limit=${limit}&page=${products.nextPage}`
    : null;

  return products;
};

const getProductById = async (id) => {
  const product = await productMain.getProductById(id);

  if (!product) {
    throw new Error(`The product id : ${id} does not exist`);
  }
  return product;
};

const addProduct = async (prod, imagesFiles) => {
  const urlsCreated = urlCreator(imagesFiles,"products");
  prod.thumbnails = urlsCreated;
  const response = await productMain.addProduct(prod);
  return response;
};

const updateProduct = async (idProd, prodUpgrade, imagesFiles) => {
  const urlsCreated = urlCreator(imagesFiles,"products");
  prodUpgrade.thumbnails = urlsCreated;
  const response = await productMain.updateProduct(idProd, prodUpgrade);
  return response;
};

const deleteProduct = async (prodId, userId, userRol, product) => {
  let response;
  if (
    (userRol === "premium" && product.owner == userId) ||
    userRol === "admin"
  ) {
    response = await productMain.deleteProduct(prodId);
  }else{
    throw new Error(`Error deleted product, not permission`);
  }
  return response;
};

const createMock = async () => {
  const productsMocks = [];
  for (let i = 0; i < 100; i++) {
    productsMocks.push(generateProducts());
  }
  return productsMocks;
};

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  createMock,
};
