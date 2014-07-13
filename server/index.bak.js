'use strict';

var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  Player = require('./models/player'),
  Room = require('./models/room'),
  //= ===== tmp
  myRoom,
  Maze = require('./models/maze'),
  players = {},
  clients = [];

app.use(express.static(__dirname + './../build'));

io.on('connection', function(socket, playerName) {
  var player = new Player(socket.id, 'Monkey');
  clients.push(socket);
  players[socket.id] = player;
  player.enterRoom(myRoom);

  socket.on('disconnect', function() {
    var index = clients.indexOf(socket);
    if (index != -1) {
      clients.splice(index, 1);
      delete players[socket.id];
      updateAll();
      console.info('Client gone (id=' + socket.id + ').');
    }
  });

  socket.on('player_move', function(dir) {
    var player = players[socket.id],
      index = clients.indexOf(socket),
      other = clients.slice(0);
    other.splice(index, 1);

    player.move(dir);

    var update = {
      name: player.name,
      location: {
        x: player.location.x,
        y: player.location.y
      }
    };

    socket.emit('player_update', update);
    updateAll();
    console.info(player.id + ' has moved!');
  });

  function updateAll() {
    clients.forEach(function(client) {
      var otherArray = [];
      for (var player in players) {
        if (client.id != players[player].id) {
          otherArray.push({
            id: players[player].id,
            x: players[player].location.x,
            y: players[player].location.y
          })
        }
      }
      if (otherArray.length > 0) {
        client.emit('other_update', otherArray);
      }
    });
  };

  io.emit('map_rerender', myRoom.print());
});

http.listen(port, ip, function() {
  myRoom = new Room(15, 15, 3);
  console.log('Listening on port %d', http.address().port);
});