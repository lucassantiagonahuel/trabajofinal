import __dirname from "../utils/utils.js";
import productsService from "../service/productsService.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import { generateUserErrorInfo } from "../service/errors/info.js";
import MailingService from "../service/mailingService.js";

const getProducts = async (req, res) => {
  try {
    const { limit, page, sort, ...filters } = req.query;
    const products = await productsService.getProducts(
      filters,
      sort,
      limit,
      page
    );
    res.send(products);
  } catch (error) {
    req.logger.error(`Error al cargar los productos!`);
    res.status(error.status).send("Error al cargar los productos");
  }
};

const getProductById = async (req, res) => {
  try {
    const prodId = req.params.pid;
    const product = await productsService.getProductById(prodId);
    res.send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const prod = req.body;
    const imagesFiles = req.files;
    if (!prod.code) {
      CustomError.createError({
        name: "Product error",
        cause: generateUserErrorInfo({ prod }),
        message: "Error al crear el producto desde diccionario",
        code: EErrors.INVALID_TYPES_ERROR,
      });
      req.logger.error(`Error al crear el producto!`);
    }
    if (!prod.owner || req.user.user.role != "premium") {
      prod.owner = "admin";
    }
    const response = await productsService.addProduct(prod, imagesFiles);
    res.send(response);
  } catch (error) {
    console.log(error);
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const prodId = req.params.pid;
    const prodUpgrade = req.body;
    const imagesFiles = req.files;
    const response = await productsService.updateProduct(
      prodId,
      prodUpgrade,
      imagesFiles
    );
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const prodId = req.params.pid;
    const userId = req.user.user._id;
    const userRol = req.user.user.role;
    const product = await productsService.getProductById(prodId);
    const response = await productsService.deleteProduct(
      prodId,
      userId,
      userRol,
      product
    );
    if (userRol === "premium") {
      const emailSend = new MailingService();
      await emailSend.sendEmailDeletedProduct(req.user.user.email, product._id);
    }
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createMock = async (req, res) => {
  try {
    req.logger.warning("Remember to create products only for testing");
    const enviroment = process.env.ENVIRONMENT;
    const response = await productsService.createMock();
    if (enviroment === "dev") {
      req.logger.info("Create products for mock : ");
      req.logger.debug(`Products : ${response}`);
    } else {
      req.logger.error("Error create products mocks only test enviroment");
      throw new Error(`Error products mocks only available for test`);
    }
    req.logger.info(`Create products for mocks!`);
    res.send(response);
  } catch (error) {
    req.logger.error(`Error in creation products mocks ${error}`);
    res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createMock,
};
