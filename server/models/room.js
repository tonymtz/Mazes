(function(module) {
  'use strict';

  var Maze = require('./maze'),
    Room = function(height, width, multiplicator) {
      this.players = [];
      this.map = new Maze(height, width, multiplicator);
      this.multiplicator = multiplicator;
    };

  Room.prototype.print = function() {
    var map = this.map.slice(0),
      player;
    // for (var i = 0; i < this.players.length; i += 1) {
    //   player = this.players[i];
    //   map[player.location.x][player.location.y] = 9;
    // }
    return map;
  }

  module.exports = Room;
})(module || this);