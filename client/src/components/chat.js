// копонент тела чата. отвечает за отправку-отрисовку сообщений.
// Видеосвязь и учет пользователей проходит на нижнем копоненте stream
import React from 'react';
import io from 'socket.io-client';
import Stream from './stream';
import './chatroom.css';
const socketUrl='http://localhost:5000';
const {MESSAGE_SENT} = require('../events')

class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      socket:null
    }
  }

  componentWillMount() {
    this.initSocket()
  }

  componentDidUpdate(){
    this.chatWindowRef.scrollTop = this.chatWindowRef.scrollHeight;
  }
  

// на этапе инициализации привязываем к рассылке сообщений от сервера
  // фильтрация сообщений по комнатам(по id)
  initSocket = ()=>{
    const socket = io(socketUrl)
    socket.on(MESSAGE_SENT, message => {
      if(message.chat===this.props.id)
      {this.setState({ messages:message.messageArray})}
    })
    this.setState({socket});
  }
// собираем сообщение из никнейма, послания,id комнаты и отправляем на сервер
  handleSubmit = event => {
    event.preventDefault();
    const body = event.target.elements.input.value
    if (body) {
      const message = {
        body,
        from: this.props.name,
        chat:this.props.id
      }
      this.state.socket.emit(MESSAGE_SENT, message)
      event.target.elements.input.value = ''
    }
  }

  render() {
    // перед рендером создается компонент message из массива,который сформирован на сервере
    // в соответсвующей комнате,
    // содержащего сообщения, приходящего сервера.
    const {socket}=this.state;
    const id =this.props.id;
    const messages = this.state.messages.map((message, index) => {
      return <li key={index}>
      <b>{message}</b>
      </li>

    });

    return(
      <div>
        <h1>ЧАт волчат</h1>
        <div className='chatRoom'>
          <Stream socket={socket} id={id}></Stream>
          <div>
          <form  onSubmit={this.handleSubmit}>
              <input
                id='input'
                type="text"
                placeholder='Enter a message'/>
            </form>
          <div 
          ref={(chatWindowRef)=>this.chatWindowRef=chatWindowRef}
          className='chatWindow'>
            {messages}
          </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Chat;
