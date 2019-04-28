// Здесь происходит отрисовка видеосвязи, ее установление
// учет пользователей происходит тоже тут
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MediaHandler from './mediaHandler';
import {JOIN_ROOM} from '../events';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
import './stream.css';

export default class Stream extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMedia: false,
      otherUserId: null,
      participants:null
    };

    this.user = {id:localStorage.getItem('id')};
    this.user.stream = null;
    this.users=[];
    this.peers = {};

    this.mediaHandler = new MediaHandler();
    this.setupPusher();

    this.callTo = this.callTo.bind(this);
    this.setupPusher = this.setupPusher.bind(this);
    this.startPeer = this.startPeer.bind(this);
  }

  componentWillMount() {
    const socket=this.props.socket;
// при подключении пользователя его данные отправляются на сервер, вместе с данными
// комнаты, для установления уникальности
    socket.on('connect', () => {
     socket.emit(JOIN_ROOM,this.props.id,localStorage.getItem('id'),localStorage.getItem('name'));
    })
// фильтрация пользовтаеля по комнате,
// при сопастовлении идет в добавок
    socket.on(JOIN_ROOM, (roomId,participants) => {
      if (roomId==this.props.id) {
        this.setState({
          participants: participants
        });
        this.participantsAdder();
      }
    })

    this.mediaHandler.getPermissions()
      .then((stream) => {
        this.setState({
          hasMedia: true
        });
        this.user.stream = stream;

        try {
          this.myVideo.srcObject = stream;
        } catch (e) {
          this.myVideo.src = URL.createObjectURL(stream);
        }

        this.myVideo.play();
      })
  }
// отрисовка кнопок звонка идет через массив, котроый содержит айди для пиров
  participantsAdder(){
    this.users=[];
  if (this.state.participants!==null) {
    for (let i = 0; i < this.state.participants.length; i++) {
         if (this.state.participants[i].id!=this.user.id) {
           this.users.push(this.state.participants[i])
            }
          }
       }
     }

  setupPusher() {
      this.pusher = new Pusher('fd3df13aec3b16a9a3af', {
        cluster: 'eu',
        authEndpoint: 'http://localhost:5000/pusher/auth',
        forceTLS: true
      });
    this.channel = this.pusher.subscribe('presence-videocall');

    this.channel.bind(`client-signal-${this.user.id}`, (signal) => {

      let peer = this.peers[signal.userId];

      // проверка создан ли уже данный пир, если создан - совершается звонок
      if (peer === undefined) {
        this.setState({
          otherUserId: signal.userId
        });
        peer = this.startPeer(signal.userId, false);
      }

      peer.signal(signal.data);
    });
  }

  startPeer(userId, initiator = true) {
    const peer = new Peer({
      initiator,
      stream: this.user.stream,
      trickle: false
    });

    peer.on('signal', (data) => {
      this.channel.trigger(`client-signal-${userId}`, {
        type: 'signal',
        userId: this.user.id,
        data: data
      });
    });

    peer.on('stream', (stream) => {
      try {
        this.userVideo.srcObject = stream;
      } catch (e) {
        this.userVideo.src = URL.createObjectURL(stream);
      }
      console.log('go');
      this.userVideo.play();
    });

    peer.on('close', () => {
      let peer = this.peers[userId];
      if (peer !== undefined) {
        peer.destroy();
      }

      this.peers[userId] = undefined;
    });

    return peer;
  }

  callTo(userId) {
    this.peers[userId] = this.startPeer(userId);
  }

  render() {
    // перед отрисовкой списка пользователей идет проверка актуального числа
    // [пользователи, покинувшие чат пока не учитываются]
    // также проверяется установлен ли стейт с участгиками чатрума, воизбежание ошибок
        let participants;
        let buttons;
        let participantsNumber;
        this.state.participants==null?participantsNumber=0:participantsNumber=this.state.participants.length;
        if(this.state.participants!==null){
          buttons=this.users.map((user) => {
              return this.user.id !== user.id ? <button className="btn btn-outline-warning" key={user.id} onClick={() => this.callTo(user.id)}>Call {user.name}</button> : null;
          })
           participants= this.state.participants.map((participant,index)=>{
             return<span key={index}>
             <span className='participants'>{participant.name}</span>
             </span>
           })
        }
        if(this.state.participants==null) {
          participants = <b></b>
        }
        return (
            <div className="streamWindow">
                {buttons}
                <div className='participants'>количество участников:{participantsNumber}</div>
                {participants}
                <div className="video-container"></div>
                <div className="video-container">
                    <video className="my-video" ref={(ref) => {this.myVideo = ref;}}></video>
                    <video className="user-video" ref={(ref) => {this.userVideo = ref;}}></video>
                </div>
            </div>
        );
    }
}
