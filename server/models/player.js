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

  function checkCollision(other) {
    return other.type === 'wall';
  }

  Player.prototype.move = function(maze, dir) {
    var x = this.location.x,
      y = this.location.y;
    switch(dir) {
      case 'left':
        if (checkCollision(maze[x - 1][y])) break;
        maze[x][y] = 0;
        this.location.x -= 1;
        maze[this.location.x][y] = 9;
        break;
      case 'right':
        if (checkCollision(maze[x + 1][y])) break;
        maze[x][y] = 0;
        this.location.x += 1;
        maze[this.location.x][y] = 9;
        break;
      case 'down':
        if (checkCollision(maze[x][y + 1])) break;
        maze[x][y] = 0;
        this.location.y += 1;
        maze[x][this.location.y] = 9;
        break;
      case 'up':
        if (checkCollision(maze[x][y - 1])) break;
        maze[x][y] = 0;
        this.location.y -= 1;
        maze[x][this.location.y] = 9;
        break;
    }
    return this;
  };

  module.exports = Player;
})(module || this);
