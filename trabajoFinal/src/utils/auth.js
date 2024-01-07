import jwt from "jsonwebtoken";
import passport from "passport";
import config from "../config/config.js";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, config.privateKeyJwt, { expiresIn: "1h" });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "Not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.privateKeyJwt, (error, credentials) => {
    if (error) {
      return res.status(403).send({ error: "Not authorized" });
    }
    req.user = credentials.user;
    next();
  });
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (roles) => {
  return async (req, res, next) => {
    console.log(req.user);
    if (!req.user) return res.status(401).send({ error: "Unauthorized" });

    const userRoles = req.user.user ? [req.user.user.role] : [req.user.role];

    const hasPermission = roles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).send({ error: "No permissions" });
    }

    next();
  };
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.privateKeyJwt, (error, credentials) => {
      if (error) {
        reject(error);
      } else {
        resolve(credentials.user);
      }
    });
  });
};

