// методы для управления патоками данных socket.io
const io = require('./server.js').io;
const rooms = require('./rooms.js')
const roomsDepot = require('./roomsDepot.js')
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
let connectedUser = {};


module.exports = function(socket) {
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUser, nickname)) {
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
    connectedUser = addUser(connectedUser, user)
    socket.user = user
    console.log(connectedUser);
  })
  socket.on(MESSAGE_SENT, body => {
    let mes = body.body
    let sender = body.from;
    let roomId = body.chat;
    let room = roomsDepot.findRoom(roomId);
      const messages = roomsDepot.messageController(rooms.rooms[room],sender,mes)
    console.log(messages);

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
    roomsDepot.buildRoom(route)
  })
  socket.on(JOIN_ROOM, (roomId, userId, userName) => {
    let participants;
    let room = roomsDepot.findRoom(roomId);
    if (room) {
    roomsDepot.participantsController(rooms.rooms[room],userId,userName);
    participants = rooms.rooms[room].participants;
    }
    socket.broadcast.emit(JOIN_ROOM,roomId,participants)
    socket.emit(JOIN_ROOM,roomId,participants)
  })
}

function addUser(userList, user) {
  let newList = Object.assign({}, userList)
  newList[user.name] = user
  return newList
}

function removeUser(userList, username) {
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

function isUser(userList, username) {
  return username in userList
}
