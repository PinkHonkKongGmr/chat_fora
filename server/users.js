// Здесь хранятся юзера
module.exports = {
  users: [],
  addUser: function(user) {
    this.users.push(user);
  },
  buildUser: function(user) {
    console.log(user);
    this.addUser({
      id:user.id,
      name:user.name
    })
  }
}
