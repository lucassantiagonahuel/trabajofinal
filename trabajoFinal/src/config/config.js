import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  mongoUrlTest: process.env.MONGO_URL_TEST,
  clientIdGithub: process.env.CLIENT_ID_GITHUB,
  clientSecretGithub: process.env.CLIENT_SECRET_GITHUB,
  callbackUrlGithub: process.env.CALLBACK_URL_GITHUB,
  privateKeyJwt: process.env.PRIVATE_KEY_JWT,
  service: process.env.SERVICE,
  userEmail: process.env.USEREMAIL,
  password: process.env.PASSWORD,
  portEmail : +process.env.PORTEMAIL
};
