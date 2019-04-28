// шаблоны-заготовки для чата, используется для создания юзера и генерации его id
// Файл Был в основополагающем проекте. Подчищать пока не стал так как возможен рефакторинг
const uuidv4 =require('uuid/v4');
const createUser = ({name=""}={})=>({
  id:uuidv4(),
  name
})


const createMessage = ({message="",sender=""}={})=>
({
  id:uuidv4(),
  time:getTime(new Date(Date.now())),
  message,
  sender
})

const createChat =({messages=[],name='Community',user=[]}={})=>({
  id:uuidv4(),
  name,
  massages,
  users,
  typingUsers:[]
})

const getTime =(date)=>
{
  return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports ={
  createMessage,
  createChat,
  createUser,
  getTime
}
