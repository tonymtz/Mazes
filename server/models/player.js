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

  Player.prototype._checkCollision = function(other) {
    if (other === undefined) return 2;
    if (other === 2) return 0;
    return 1;
  }

  Player.prototype.move = function(maze, dir) {
    /*
     * 0 for nothing
     * 1 for walk into new position
     * 2 for warping to new map
     */
    var x = this.location.x,
      y = this.location.y;

    var newPosition = { x: 0, y: 0 };

    if (dir == 'up') newPosition = { x: x, y: y - 1 };
    else if (dir == 'right') newPosition = { x: x + 1, y: y };
    else if (dir == 'down') newPosition = { x: x, y: y + 1 };
    else if (dir == 'left') newPosition = { x: x - 1, y: y };

    var nextToDo = maze[newPosition.x] === undefined ? 2 : this._checkCollision(maze[newPosition.x][newPosition.y]);

    if (nextToDo === 1) {
      this.location.x = newPosition.x;
      this.location.y = newPosition.y;
      maze[newPosition.x][newPosition.y] = 9;
    } else if (nextToDo === 2) {
      if (dir == 'up') this.location.y = maze[0].length;
      else if (dir == 'right') this.location.x = 0;
      else if (dir == 'down') this.location.y = 0;
      else if (dir == 'left') this.location.x = maze.length;
    }

    return nextToDo;
  };

  module.exports = Player;
})(module || this);
