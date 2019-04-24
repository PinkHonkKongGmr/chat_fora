
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './components/auth'
import Chatroom from './components/chatroom'


ReactDOM.render((
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path='/' component={Auth}/>
        <Route exact path='/chatroom/:id' component={Chatroom}/>
    
      </Switch>
    </App>
  </BrowserRouter>
), document.getElementById('root'));
