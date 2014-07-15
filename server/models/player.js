#!/bin/env node
(function(module) {
  'use strict';

  var
  // var o = require('o-dot'),
    Player = function(id, name) {
      this.id = id;
      this.name = name;
      this.room = 0;
      this.location = {
        x: 3,
        y: 3
      };
    };

  Player.prototype._checkCollision = function(maze, x, y) {
    var other;
    if (maze[x] === undefined || maze[x][y] === undefined) {
      return true;
    }
    other = maze[x][y];
    return other.type === 'wall';
  }

  Player.prototype.move = function(maze, dir) {
    var x = this.location.x,
      y = this.location.y;

    switch(dir) {
      case 'up':
        if (this._checkCollision(maze, x, y - 1)) break;
        maze[x][y] = 0;
        this.location.y -= 1;
        maze[x][this.location.y] = 9;
        return 1;
      case 'right':
        if (this._checkCollision(maze, x + 1, y)) break;
        maze[x][y] = 0;
        this.location.x += 1;
        maze[this.location.x][y] = 9;
        return 1;
      case 'down':
        if (this._checkCollision(maze, x, y + 1)) break;
        maze[x][y] = 0;
        this.location.y += 1;
        maze[x][this.location.y] = 9;
        return 1;
      case 'left':
        if (this._checkCollision(maze, x - 1, y)) break;
        maze[x][y] = 0;
        this.location.x -= 1;
        maze[this.location.x][y] = 9;
        return 1;
    }
    return 2;
  };

  module.exports = Player;
})(module || this);
