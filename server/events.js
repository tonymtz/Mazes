#!/bin/env node
(function(module) {
  'use strict';

  module.exports = function(http) {
    var io = require('socket.io')(http),
      eventCtrl = require('./controllers/events');

    io.on('connection', function(socket) {
      var events = new eventCtrl(socket);
      console.log('CONN: %s', socket.id);

      socket.on('player_move', function(dir) {
        events.player_move(dir);
        console.log('MOVE: %s', socket.id);
      });

      socket.on('need_map', function() {
        events.returnMap(socket);
      });

      socket.on('need_player', function() {
        events.returnPlayer(socket);
      });

      socket.on('disconnect', function() {
        events.player_drop();
        console.log('DISC: %s', socket.id);
      });

      events.init();
    });
  };
})(module || this);
