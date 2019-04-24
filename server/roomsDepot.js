// Методы для управлением сосоянием комнат, а также их построения и манипулирования данными
// создать новую комнату, найти конкретную по урлу, получить данные отрносительно количества пользователей в комнате
const rooms = require('./rooms.js')
module.exports = {
  buildRoom: function(route) {
    rooms.addRoom({
      id: route,
      numbers: 0,
      participants: [],
      messages:[]
    })
  },
  // поиск конкретной комнаты по айди
  findRoom: function(roomId) {
      let thisRoomIndex;
      for (let ind in rooms.rooms) {
      if (rooms.rooms[ind].id == roomId) {
        thisRoomIndex=ind;
      }
    }

      return thisRoomIndex;
  },
  // проверка уникальности пользователя, получаем число уникальных
  // пользователей в комнате
  participantsController: function(room,userId,userName) {
    let number;
    let newUSer = {
      id: userId,
      name: userName
    }
    for (let usr of room.participants) {
      if (usr.id == userId) {
        number = room.participants.length;
        return number;
      }
    }
    room.participants.push(newUSer)
    number = room.participants.length;
    return number;
  },
  messageController:function(room,from,message){
    let msg = from+':'+message
    room.messages.push(msg);
    return room.messages
  }
}
