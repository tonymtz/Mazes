(function(module) {
  'use strict';

  var
  // var o = require('o-dot'),
    Player = function(id, name) {
      this.id = id;
      this.name = name;
      this.location = {
        x: 1,
        y: 1,
        room: 0
      };
    };

  Player.prototype.enterRoom = function(room) {
    var self = this,
      oldRoom = this.location.room,
      // indexOfPlayer = o.index(oldRoom.players, function(player) {
      //   return player.name === self.player.name;
      // });
      indexOfPlayer = 0;

    if (oldRoom) {
      oldRoom.players.splice(indexOfPlayer, 1);
    }

    this.location.room = room;
    room.players.push(this);
    room.map[this.location.x][this.location.y] = 9;
  };

  Player.prototype.move = function(dir) {
    var map = this.location.room.map;
    switch(dir) {
      case 'left':
        if (map[this.location.x - 1][this.location.y] === 1) break;
        map[this.location.x][this.location.y] = 0;
        this.location.x -= 1;
        map[this.location.x][this.location.y] = 9;
        break;
      case 'right':
        if (map[this.location.x + 1][this.location.y] === 1) break;
        map[this.location.x][this.location.y] = 0;
        this.location.x += 1;
        map[this.location.x][this.location.y] = 9;
        break;
      case 'down':
        if (map[this.location.x][this.location.y + 1] === 1) break;
        map[this.location.x][this.location.y] = 0;
        this.location.y += 1;
        map[this.location.x][this.location.y] = 9;
        break;
      case 'up':
        if (map[this.location.x][this.location.y - 1] === 1) break;
        map[this.location.x][this.location.y] = 0;
        this.location.y -= 1;
        map[this.location.x][this.location.y] = 9;
        break;
    }
  };

  module.exports = Player;
})(module || this);
