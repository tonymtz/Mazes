#!/bin/env node
(function(module) {
  'use strict';

  var Maze = require('./maze'),
    Room = function(id) {
      this.id = id;
      this.maze = new Maze(15, 15, 3);
      this.players = [];
    };

  Room.prototype.print = function() {
    return this.maze;
  }

  module.exports = Room
})(module || this);
