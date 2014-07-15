#!/bin/env node
(function(module) {
  'use strict';

  var Room = require('../models/room'),
    roomsList = {},
    startRoom;

  module.exports = (function() {
    var id = new Date().getTime();
    startRoom = new Room(id);
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
        var newRoom;
        newRoom = this.create();
        console.log('oldRoom: ', roomId);
        console.log('newRoom: ', newRoom.id);
        roomsList[roomId].neighbors[dir] = newRoom.id;
        console.log('DEBUG: ', roomsList[roomId].neighbors);
        return newRoom;
      },
      delete: function(id) {
        delete roomsList[id];
      },
      addPlayer2Room: function(id, playerId) {
        roomsList[id].players.push(playerId);
      },
      deletePlayerFromRoom: function(id, playerId) {
        var players = roomsList[id].players,
          index = players.indexOf(playerId);
        if (index >= 0) {
          players.splice(index, 1);
        }
      }
    };
  })();
})(module || this);
