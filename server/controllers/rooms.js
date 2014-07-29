#!/bin/env node
(function(module) {
  'use strict';

  var Room = require('../models/room'),
    roomsList = {},
    startRoom;

  function inverseDir(dir) {
    if (dir === 'up') return 'down';
    if (dir === 'right') return 'left';
    if (dir === 'down') return 'up';
    return 'right';
  }

  module.exports = (function() {
    var id = new Date().getTime();
    startRoom = new Room(id, 'forest', null, null, null, 'Hera\'s Forest');
    roomsList[id] = startRoom;

    return {
      get: function(id) {
        return roomsList[id];
      },
      getAll: function() {
        return roomsList;
      },
      getStarter: function() {
        return startRoom;
      },
      create: function() {
        var id = new Date().getTime();
        while (roomsList[id]) {
          id = new Date().getTime();
        }
        roomsList[id] = new Room(id);
        return roomsList[id];
      },
      generateNextFor: function(roomId, dir) {
        var oldRoom = roomsList[roomId],
          newRoom = this.create();
        roomsList[newRoom.id] = newRoom;
        oldRoom.neighbors[dir] = newRoom.id;
        newRoom.neighbors[inverseDir(dir)] = oldRoom.id;
        return newRoom;
      },
      delete: function(id) {
        delete roomsList[id];
      },
      addPlayer2Room: function(roomId, playerId) {
        roomsList[roomId].players.push(playerId);
      },
      deletePlayerFromRoom: function(roomId, playerId) {
        var players = roomsList[roomId].players,
          index = players.indexOf(playerId);
        if (index >= 0) {
          players.splice(index, 1);
        }
      }
    };
  })();
})(module || this);
