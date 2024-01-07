import { Router } from "express";
import passport from "passport";
import { authorization, passportCall } from "../utils/auth.js";
import sessionsControllers from "../controllers/sessionsControllers.js";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  sessionsControllers.login
);
router.get(
  "/current",
  passportCall("jwt"),
  authorization("admin"),
  sessionsControllers.getCurrent
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "Failed login" });
});

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  sessionsControllers.register
);

router.get("/failregister", sessionsControllers.failregister);

router.post("/logout", sessionsControllers.logout);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  sessionsControllers.github
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  sessionsControllers.githubcallback
);


export default router;
