// Здесь копмоненты отвественные за проверку верификации.
// Если она есть пользователь идет в чатрум, если нет- вводит имя
// Кроме того, если не верефицированный пользователь прошел по ссылке,
// здесь она сохраняется, чтобы потом перейти в нужную комнату
import React, {Component} from 'react';
import Layout from './layout';
import Chat from './chat';
class Chatroom extends Component {

    constructor(props) {
      super(props);
      this.state={
        id:this.props.match.params.id,
        name:localStorage.getItem('name'),
        verify:false
      }
    }

    componentWillMount(){
      if(localStorage.getItem('name')){this.setState({verify:true})}
    }

  render() {
    const verifiInd= this.state.verify;
    console.log(verifiInd);
    return (
      <div className="App">
      {verifiInd?<Chat name={this.state.name} id={this.state.id}/>:<Layout id={this.state.id}/>}
      </div>
    );
  }
}



export default Chatroom;
