import React, {Component} from 'react';
import io from 'socket.io-client';
import {USER_CONNECTED,LOGOUT} from '../events';
import LoginForm from './loginForm';
const socketUrl='http://localhost:5000';
const uuidv4 =require('uuid/v4');
export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state={
      socket:null,
      user:null,
      chatLink:null
    }
  }
// Инициализируем сокет, управляем пользователями(создаем, удаляем, проверяем уникальность)
// также на этом этапе идет проверка проел ли пользователь по ссылке конктретной комнаты или
// зашел с главной
  componentWillMount(){
    this.initSocket()
    !this.props.id?this.setState({chatLink:uuidv4()}):this.setState({chatLink:this.props.id})
  }

  initSocket = ()=>{
    const socket = io(socketUrl);
    socket.on('connect',()=>{console.log('connected')})
    this.setState({socket});
  }

  setUser=(user)=>{
    const {socket} =this.state
    socket.emit(USER_CONNECTED,user);
    this.setState({user})
  }

  logout =()=>{
    const{socket}=this.state
    socket.emit(LOGOUT)
    this.setState({user:null})
  }

  render() {
    const {socket}=this.state
    return (
      <div className="container">
        <LoginForm socket={socket} setUser={this.setUser} id={this.state.chatLink}/>
      </div>
    );
  }
}
