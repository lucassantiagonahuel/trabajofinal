import { generateToken } from "../utils/auth.js";
import sessionsService from "../service/sessionsService.js";

const register = async (req, res) => {
  req.logger.info(`User registered ok!`);
  res.send({ status: "Success", message: "User registered ok" });
};

const login = async (req, res) => {
  if (!req.user) {
    return res.status(400).send("Invalid credentials");
  }

  // req.session.user = {
  //   fullName: `${req.user.first_name} ${req.user.last_name}`,
  //   email: req.user.email,
  //   rol: req.user.rol,
  // };
  const access_token = generateToken(req.user);
  req.logger.info(`Usuario logueado correctamente!`);
  res
    .cookie("coderCookieToken", access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .send({ message: "Logged in!" });
};

const getCurrent = async (req, res) => {
  res.send({ status: "success", payload: req.user });
};

const failregister = async (req, res) => {
  res.send({ error: "Failed" });
};

const logout = async (req, res) => {
  // req.session.destroy((error) => {
  //   if (error) return res.send("La sesion no se pudo cerrar");
  //   res.redirect("/");
  // });
  const user = req.user;
  await sessionsService.updateConnection(user);
  res.clearCookie("coderCookieToken");

  res.clearCookie("connect.sid");
  res.redirect("/login");
};

const github = async (req, res) => {};

const githubcallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/");
};

export default {
  register,
  login,
  getCurrent,
  failregister,
  logout,
  github,
  githubcallback,
};
