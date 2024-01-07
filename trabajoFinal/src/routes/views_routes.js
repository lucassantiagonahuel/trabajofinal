import express from "express";
import { ProductManager } from "../dao/manager/managerProducts.js";
import { ProductClass } from "../dao/class/productsClass.js";
import { CartClass } from "../dao/class/cartClass.js";
import __dirname from "../utils/utils.js";
import {
  authToken,
  authorization,
  generateToken,
  passportCall,
} from "../utils/auth.js";
const dbFolderPath = __dirname + "/../db";
const productsPath = dbFolderPath + "/Products.json";
import viewsControllers from "../controllers/viewsControllers.js";

const productManager = new ProductManager(productsPath);
let productClass = new ProductClass();
let cartClass = new CartClass();
let productMain = productClass;

const router = express.Router();

const publicAccess = (req, res, next) => {
  if (req.user) return res.redirect("/products");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

router.get("/", passportCall("jwt"), viewsControllers.getAllProducts);

router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  viewsControllers.getRealTimeProducts
);

router.get(
  "/chat",
  passportCall("jwt"),
  authorization("user"),
  viewsControllers.chat
);

router.get("/products", passportCall("jwt"), viewsControllers.getListProducts);

router.get("/cart/:cid", viewsControllers.getCart);

router.get(
  "/productdetail",
  passportCall("jwt"),
  viewsControllers.productDetail
);

router.get("/login", viewsControllers.login);

router.get("/register", publicAccess, viewsControllers.register);

router.get("/resetPassword", viewsControllers.resetPassword);

router.get("/changePassword/:token",viewsControllers.changePassword);

router.get(
  "/current",
  passportCall("jwt"),
  authorization("admin"),
  viewsControllers.getCurrent
);

export default router;
