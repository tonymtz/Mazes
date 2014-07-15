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
      return playersList[id];
    },
    delete: function (id) {
      delete playersList[id];
    },
    move: function(id, dir) {
      var player = playersList[id],
        room = rooms.get(player.room),
        maze = room.maze,
        result = player.move(maze, dir);
      console.log('player: ', player.id);
      console.log('room: ', player.room);
      if (result === 2) {
        console.log(' = warpeando = ');
        var nextRoom = maze[dir];
        if (!nextRoom) {
          nextRoom = rooms.generateNextFor(room.id, dir);
        }
        rooms.deletePlayerFromRoom(player.room, player.id);
        rooms.addPlayer2Room(nextRoom.id, player.id);
      }
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
