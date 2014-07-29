#!/bin/env node
(function(module) {
  'use strict';

  var _ = require('underscore'),
    Map = require('./map'),
    Maze = require('./maze'),
    Room = function(id, type, height, width, exits, name, multiplier) {
      this.id = id;
      this.name = 'map ' + id;
      this.height = height || 39;
      this.width = width || 39;
      this.exits = exits || 4;
      this.multiplier = multiplier || 1;
      // this.maze = new Maze(this.height, this.width, this.multiplier, this.exits);
      this.maze = new Map(this.height, this.width, this.multiplier, this.exits);
      this.players = [];
      this.neighbors = {
        up: null,
        right: null,
        down: null,
        left: null
      };
      this.json = (function() {
        var json = {};

        json.height = this.height * this.multiplier;
        json.width = this.width * this.multiplier;
        json.name = this.name;
        json.tileset = type || ['forest', 'dungeon', 'mountain', 'cave', 'snow', 'desert'][Math.floor(Math.random() * 6)];

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
