import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products_routes.js";
import cartRouter from "./routes/cart_routes.js";
import userRouter from "./routes/user_routes.js";
import viewsRouter from "./routes/views_routes.js";
import sessionsRouter from "./routes/sessions_routes.js";
import path from "path";
import { configureWebSocket } from "./utils/websocket.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializatePassport from "./config/passport.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { addLogger } from "./utils/logger.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { swaggerOptions } from "./utils/swagger.js";
import db from "./db/db.js";
import mongoose from "mongoose";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");
const specs = swaggerJsdoc(swaggerOptions);

const app = express();
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(publicPath));
app.use(cookieParser());
app.use(addLogger);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      ttl: 200000,
    }),
    secret: "EcommerceSecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  if (req.originalUrl === "/") {
    return res.redirect("/login");
  }
  next();
});

const PORT = process.env.port || 8080;
const connection = mongoose.connect(process.env.MONGO_URL);

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(config.port, () => console.log("Server ON!"));

configureWebSocket(httpServer);
