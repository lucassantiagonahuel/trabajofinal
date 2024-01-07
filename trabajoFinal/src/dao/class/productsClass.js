import { sortOrder } from "../../utils/utils.js";
import { productModel } from "../models/product.js";

export class ProductClass {
  //constructor() {}

  getProducts = async (filter, sortOrd, limitProd, pageSearch) => {
    const response = await productModel.paginate(filter, {
      limit: limitProd,
      page: pageSearch,
      sort: sortOrder(sortOrd),
    });
    return response;
  };

  getProductById = async (idProduct) => {
    let product = await productModel.findById(idProduct);
    return product;
  };

  addProduct = async (product) => {
    const response = await productModel.create(product);

    return response;
  };

  updateProduct = async (idProd, prodUpgrade) => {
    return productModel.updateOne({ _id: idProd }, prodUpgrade);
  };

  deleteProduct = async (idProd) => {
    return productModel.deleteOne({ _id: idProd });
  };
}
