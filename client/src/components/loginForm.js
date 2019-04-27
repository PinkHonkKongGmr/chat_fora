import React, {Component} from 'react';
import {VERIFY_USER,NEW_ROOM} from '../events'
import '../main.css';
class LoginForm extends Component {
  constructor(props){
    super(props);
    this.state ={
      nickname:"",
      error:"",
      login:false,
      chatLink:'/chatroom/'+this.props.id
    };
  }

  setUser=({user,isUser})=>{
    console.log(isUser);
    if(isUser)
    {
      this.setError('такой волчонок уже есть')
    }
    else {
      const {socket} = this.props
      this.props.setUser(user)
      this.setState({login:true})
      localStorage.setItem('name',user.name)
      localStorage.setItem('id',user.id);
      socket.emit(NEW_ROOM,this.props.id);
      setTimeout(()=> {
        window.location.href=this.state.chatLink;
      }, 0);

    }
  }
  handleSubmit=event=>{
    event.preventDefault();
    const {socket} = this.props
    const {nickname} = this.state
    socket.emit(VERIFY_USER,nickname,localStorage.getItem('id'),this.setUser)
  }
  handleChange=event=>{
    this.setState({nickname:event.target.value})
  }
  setError =(error)=>
  {
    this.setState({error})
    setTimeout(()=> {
      this.setState({error:""})
    }, 1100);
  }
  render() {
    const {nickname,error}=this.state
    return (
      <div className="login">
        <form onSubmit ={this.handleSubmit} className="login-form">
         <label htmlFor='nickname'>
         <h1><span className='chatV'>ЧАТ ВОЛЧАТ__</span><span className='web'>[web2019]</span></h1>
         <p>Чат без регистрации.Просто введи имя и общайся!</p>
         </label>
          <input
           ref={(input)=>{this.textInput = input}}
           type="text"
           id ="nickname"
           value = {nickname}
           onChange = {this.handleChange}
           placeholder = {'enter_here_volchonok_name'}
           />
           <div className="error">{error?error:null}</div>

        </form>
      </div>
    );
  }
}

export default LoginForm
