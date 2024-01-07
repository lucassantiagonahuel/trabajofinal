export default class UserDTO {
  constructor(user) {
    const userData = user.user;
    (this.first_name = userData.user.first_name),
      (this.last_name = userData.user.last_name),
      (this.email = userData.user.email);
  }
}
