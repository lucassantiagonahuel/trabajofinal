import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { userModel } from "../dao/models/user.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { cookieExtractor } from "../utils/auth.js";
import config from "../config/config.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const initializatePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, cart, role } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false, { message: "User already exists" });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            cart,
            role: role || "user",
            password: createHash(password),
          };

          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("User doesn't exist");
            return done(null, false, { message: "User doesn't exist" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          user.last_connection = new Date();
          const userUpdated = await userModel.findByIdAndUpdate(user._id, user);
          // if (
          //   username == "adminCoder@coder.com" &&
          //   password == "adminCod3r123"
          // ) {
          //   user.rol = "admin";
          // } else {
          //   user.rol = "user";
          // }
          return done(null, userUpdated);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.clientIdGithub,
        clientSecret: config.clientSecretGithub,
        callbackURL: config.callbackUrlGithub,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 29,
              email: profile._json.email,
              password: "",
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "coderSecret",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializatePassport;
