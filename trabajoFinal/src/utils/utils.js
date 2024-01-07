import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storageDocuments = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../public/documents`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const storageProducts = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../public/products`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const storageUsers = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../public/users`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const createUrlForFiles = (files,origin) => {
  const urls = [];
  files.forEach((file) => {
    urls.push(`http://localhost:8080/static/${origin}/${file.filename}`);
  });
  return urls;
};

const sortOrdField = (sortOrd) => {
  switch (sortOrd) {
    case "asc":
      return { price: 1 };
    case "desc":
      return { price: -1 };
    default:
      return { price: 1 };
  }
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const uploaderDocuments = multer({ storage: storageDocuments });
export const uploaderProducts = multer({ storage: storageProducts });
export const uploaderUsers = multer({ storage: storageUsers });
export const urlCreator = createUrlForFiles;
export const sortOrder = sortOrdField;
export default __dirname;
