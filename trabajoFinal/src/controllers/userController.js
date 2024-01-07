import userService from "../service/userService.js";
import { generateToken, verifyToken } from "../utils/auth.js";
import MailingService from "../service/mailingService.js";
import { urlCreator } from "../utils/utils.js";
import UsersDTO from "../dao/DTO/users.js";

const emailService = new MailingService();

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    const userDTO = new UsersDTO(users);
    res.send(userDTO);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const sendEmailResetPassword = async (req, res) => {
  try {
    const user = req.body;

    const token = generateToken(user);

    const response = await emailService.sendSimpleMail(user.email, token);

    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    const user = await verifyToken(token);
    const response = await userService.updatePassword(user, newPassword);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateRole = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userService.getUserById(userId);
    const userRol = user.role;
    const response = await userService.updateRole(user, userRol);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const sendDocumentsUser = async (req, res) => {
  try {
    const identificacion = req.files["identificacion"]?.[0] || null;
    const domicilio = req.files["domicilio"]?.[0] || null;
    const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
    const userId = req.params.uid;
    const user = await userService.getUserById(userId);
    const docs = [];
    if (identificacion) {
      const linkReference = urlCreator(
        req.files["identificacion"],
        "documents"
      );
      docs.push({ name: "identificacion", reference: linkReference[0] });
    }
    if (domicilio) {
      const linkReference = urlCreator(req.files["domicilio"], "documents");
      docs.push({ name: "domicilio", reference: linkReference[0] });
    }
    if (estadoDeCuenta) {
      const linkReference = urlCreator(
        req.files["estadoDeCuenta"],
        "documents"
      );
      docs.push({
        name: "estadoDeCuenta",
        reference: linkReference[0],
      });
    }
    if (docs.length === 3) {
      user.status = "completo";
    } else {
      user.status = "incompleto";
    }
    user.documents = docs;
    const response = await userService.userDocuments(user);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUsersInactive = async (req, res) => {
  try {
    const response = await userService.deleteUsersInactive();
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default {
  getUserByEmail,
  getUsers,
  sendEmailResetPassword,
  updatePassword,
  updateRole,
  sendDocumentsUser,
  deleteUsersInactive,
};
