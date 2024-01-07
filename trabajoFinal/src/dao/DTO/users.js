export default class UsersDTO {
  constructor(users) {
    if (!Array.isArray(users)) {
      throw new Error("Se esperaba un array de usuarios");
    }
    if (users.length > 0) {
      this.users = users.map((user) => ({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      }));
    } else {
      this.users = [];
    }
  }
}
