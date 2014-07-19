#!/bin/env node
(function(module) {
  'use strict';

  var Maze = require('./maze'),
    Room = function(id) {
      this.id = id;
      this.maze = new Maze(15, 15, 3, 4);
      this.players = [];
      this.neighbors = {
        up: null,
        right: null,
        down: null,
        left: null
      };
    };

  Room.prototype.print = function() {
    return this.maze;
  }

  module.exports = Room
})(module || this);
