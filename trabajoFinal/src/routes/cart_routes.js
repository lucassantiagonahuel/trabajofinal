import { Router } from "express";
import { uploaderProducts } from "../utils/utils.js";
import {
  authToken,
  authorization,
  generateToken,
  passportCall,
} from "../utils/auth.js";
import cartsControllers from "../controllers/cartsControllers.js";

const router = Router();

router.get("/:cid", cartsControllers.getCartById);

router.post("/", cartsControllers.createCart);

router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization(["user","premium"]),
  cartsControllers.addProductInCart
);

router.delete("/:cid/products/:pid", cartsControllers.deleteProductInCart);

router.put(
  "/:cid",
  uploaderProducts.array("thumbnails", 5),
  cartsControllers.updateCart
);

router.put("/:cid/products/:pid", cartsControllers.updateQuantityProductInCart);

router.delete("/:cid", cartsControllers.deleteCart);

router.post("/:cid/purchase", cartsControllers.purchaseCompleted);

export default router;
