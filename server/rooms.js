const {
  getTime
} = require('./factories')
// Здесь хранятся комнаты
module.exports = {
  rooms: [],
  addRoom: function(room) {
    this.rooms.push(room);
  },
  buildRoom: function(route) {
    this.addRoom({
      id: route,
      numbers: 0,
      participants: [],
      messages: []
    })
  },
  // проверка уникальности пользователя, получаем число уникальных
  // пользователей в комнате
  participantsController: function(num, userId, userName) {
    let number;
    let newUSer = {
      id: userId,
      name: userName
    }
    for (let usr of this.rooms[num].participants) {
      if (usr.id == userId) {
        number = this.rooms[num].participants.length;
        return number;
      }
    }
    this.rooms[num].participants.push(newUSer)
    number = this.rooms[num].participants.length;
    return number;
  },
  messageController: function(num, from, message) {
    let msg = `[${getTime(new Date(Date.now()))}]_${from}:${message}`;
    this.rooms[num].messages.push(msg);
    return this.rooms[num].messages
  }

}
