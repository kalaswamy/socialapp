class ChatUsers {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room, profileimg, location) {
    var user = {id, name, room, profileimg, location};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
  }
  updategeoCordinate(id, loc) {
      var user = this.getUser(id);
      user.location = loc;
  }
  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }

   getUsers (room) {
       return this.users.filter((user) => user.room === room);
   }

}

module.exports = ChatUsers