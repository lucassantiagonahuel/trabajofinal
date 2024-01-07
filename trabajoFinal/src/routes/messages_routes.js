import { Router } from "express";
import messagesControllers from "../controllers/messagesControllers.js";
import {
  authToken,
  authorization,
  generateToken,
  passportCall,
} from "../utils/auth.js";

const router = Router();

router.get("/", messagesControllers.getMessage);

router.post(
  "/",
  passportCall("jwt"),
  authorization("user"),
  messagesControllers.sendMessages
);

export default router;
