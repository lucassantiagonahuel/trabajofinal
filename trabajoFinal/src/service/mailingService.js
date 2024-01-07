import mailer from "nodemailer";
import config from "../config/config.js";

export default class MailingService {
  constructor() {
    try {
      this.client = mailer.createTransport({
        service: config.service,
        port: config.portEmail,
        auth: {
          user: config.userEmail,
          pass: config.password,
        },
      });
    } catch (error) {
      console.error(
        "Error al crear el transportador de correo electrónico:",
        error
      );
    }
  }

  sendSimpleMail = async (email, token) => {
    try {
      const changePasswordURL = `http://localhost:8080/changePassword/${token}`;
      let result = await this.client.sendMail({
        from: config.userEmail,
        to: email,
        subject: "Cambio de contraseña",
        html: `<p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p><a href="${changePasswordURL}">Apretame</a>`,
      });
      return result;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw error;
    }
  };

  sendEmailDeletedUser = async (email) => {
    try {
      let result = await this.client.sendMail({
        from: config.userEmail,
        to: email,
        subject: "Usuario eliminado",
        html: `<p>Le enviamos este correo para informarle que su usuario fue eliminado por inactividad en nuestra plataforma.</p>`,
      });
      return result;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw error;
    }
  };

  sendEmailDeletedProduct = async (email,id) => {
    try {
      console.log(email);
      console.log(id);
      let result = await this.client.sendMail({
        from: config.userEmail,
        to: email,
        subject: "Producto eliminado",
        html: `<p>Le enviamos este correo para informarle que su producto ${id} fue eliminado de la plataforma.</p>`,
      });
      return result;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw error;
    }
  };
}
