  const express = require('express');
  const config = require('./config');
  const rooms = require('./rooms');
  const app = express();
  var http = require('http').Server(app);
  var io = module.exports.io = require('socket.io')(http);
  const socketManager = require('./socketManager');
  const bodyParser = require('body-parser');
  const Pusher = require('pusher');
  const uuidv4 =require('uuid/v4');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({

    extended: true
  }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  const pusher = new Pusher({
    appId: '766415',
    key: 'fd3df13aec3b16a9a3af',
    secret: '79b4794c3ad9e32b5534',
    cluster: 'eu',
    encrypted: true
  });

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      user_id: uuidv4()
    }
    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
  });


  io.on('connection', socketManager);


  http.listen(config.PORT, () =>
    console.log(`Example app listening on port ${config.PORT}!`)
  );
