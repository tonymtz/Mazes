#!/bin/env node
(function(module) {
  'use strict';

  var _ = require('underscore'),
    Maze = require('./maze'),
    Room = function(id, height, width, exits, name) {
      this.id = id;
      this.name = 'map ' + id;
      this.height = height || 15;
      this.width = width || 15;
      this.exits = exits || 4;
      this.maze = new Maze(this.height, this.width, 3, exits);
      this.players = [];
      this.neighbors = {
        up: null,
        right: null,
        down: null,
        left: null
      };
      this.json = (function() {
        var json = {};

        json.height = this.height;
        json.width = this.width;
        json.name = this.name;
        json.tileset = ['forest', 'dungeon', 'mountain', 'cave', 'snow', 'desert'][Math.floor(Math.random() * 6)];

        var map = _.flatten(this.maze).join('');
        json.cells = new Buffer(map).toString('base64');

        return json;
      }.call(this));
    };

  Room.prototype.print = function() {
    return this.maze;
  }

  module.exports = Room
})(module || this);
