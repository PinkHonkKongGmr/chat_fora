// методы для управления патоками данных socket.io
const io = require('./server.js').io;
const rooms = require('./rooms.js');
const users = require('./users.js')
const finder = require('./finder.js');
const {
  VERIFY_USER,
  USER_CONNECTED,
  LOGOUT,
  MESSAGE_SENT,
  NEW_ROOM,
  JOIN_ROOM
} = require('./events')
// файл events представлен в двух экзеплярах, как на сервере так и на клиенте
const {
  createUser,
  createMessage,
  createChat
} = require('./factories')


module.exports = function(socket) {
  socket.on(VERIFY_USER, (nickname, id, callback) => {
    if (isUser(nickname, id)) {
      callback({
        isUser: true,
        user: null
      })
    } else {
      callback({
        isUser: false,
        user: createUser({
          name: nickname
        })
      })
    }
  })
  socket.on(USER_CONNECTED, (user) => {
    users.buildUser(user)
    socket.user = user
    // console.log(connectedUser);
  })
  socket.on(MESSAGE_SENT, body => {
    let mes = body.body
    let sender = body.from;
    let roomId = body.chat;
    let room = finder.findCurrent(rooms.rooms, roomId);
    const messages = rooms.messageController(room, sender, mes)

    socket.broadcast.emit(MESSAGE_SENT, {
      messageArray: messages,
      chat: roomId
    })
    socket.emit(MESSAGE_SENT, {
      messageArray: messages,
      chat: roomId
    })
  })
  socket.on(NEW_ROOM, (route) => {
    rooms.buildRoom(route)
  })
  // Получаем сигнал о подключении пользователя
  // Проверем уникальность пользователя в комнате, если уникален - вносим
  // Обновляем список пользователей
  socket.on(JOIN_ROOM, (roomId, userId, userName) => {
    let participants;
    let room = finder.findCurrent(rooms.rooms, roomId);
    if (room) {
      rooms.participantsController(room, userId, userName);
      participants = rooms.rooms[room].participants;
    }
    socket.broadcast.emit(JOIN_ROOM, roomId, participants)
    socket.emit(JOIN_ROOM, roomId, participants)
  })
}

function removeUser(userList, username) {
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

function isUser(username, id) {

  let user = finder.findCurrent(users.users, username);
  console.log(user,users.users);
  if (!user||users.users[user].id==id) {
    return false;
  }
  else {
    return true;
  }
}
