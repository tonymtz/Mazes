#!/bin/env node
(function(module) {
  'use strict';

  var Player = require('../models/player'),
    rooms = require('./rooms'),
    playersList = {};

  module.exports = {
    get: function(id) {
      return playersList[id];
    },
    getAll: function() {
      return playersList;
    },
    create: function(id, name) {
      if (!playersList[id]) {
        playersList[id] = new Player(id, 'Monkey');
      }
    },
    delete: function (id) {
      delete playersList[id];
    },
    move: function(id, dir) {
      var player = playersList[id],
        maze = rooms.get(player.room).maze;
      player = player.move(maze, dir);
      return {
        name: player.name,
        location: {
          x: player.location.x,
          y: player.location.y
        }
      };
    },
    enter2Room: function(playerId, roomId) {
      var player = playersList[playerId];
      if (player.room) {
        rooms.deletePlayerFromRoom(player.room, player.id);
      }
      rooms.addPlayer2Room(roomId, player.id);
      player.room = roomId;
    }
  };
})(module || this);
