import { Router } from "express";
import userController from "../controllers/userController.js";
import { authorization } from "../utils/auth.js";
import { uploaderDocuments } from "../utils/utils.js";

const router = Router();

router.get("/:email", userController.getUserByEmail);

router.post("/", userController.sendEmailResetPassword);

router.put("/", userController.updatePassword);

router.put(
  "/premium/:uid",
  authorization(["admin"]),
  userController.updateRole
);

router.post(
  "/:uid/documents",
  uploaderDocuments.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "domicilio", maxCount: 1 },
    { name: "estadoDeCuenta", maxCount: 1 },
  ]),
  userController.sendDocumentsUser
);

router.get("/", authorization(["admin"]), userController.getUsers);

router.delete(
  "/",
  authorization(["admin"]),
  userController.deleteUsersInactive
);

export default router;
