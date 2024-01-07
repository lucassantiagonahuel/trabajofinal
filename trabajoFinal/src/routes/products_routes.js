import { Router } from "express";
import { uploaderProducts } from "../utils/utils.js";
import productsController from "../controllers/productsControllers.js";
import {
  authToken,
  authorization,
  generateToken,
  passportCall,
} from "../utils/auth.js";
const router = Router();

router.get("/", productsController.getProducts);

router.get("/:pid", productsController.getProductById);

router.post(
  "/",
  uploaderProducts.array("thumbnails", 5),
  passportCall("jwt"),
  authorization(["admin","premium"]),
  productsController.createProduct
);

router.put(
  "/:pid",
  uploaderProducts.array("thumbnails"),
  passportCall("jwt"),
  authorization(["admin","premium"]),
  productsController.updateProduct
);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorization(["admin","premium"]),
  productsController.deleteProduct
);

router.post("/loggerTest", productsController.createMock);

export default router;
