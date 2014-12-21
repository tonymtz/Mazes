#!/bin/env node
(function(module) {
  'use strict';

  var _ = require('underscore'),
    Map = require('./map'),
    Room = function(id, type, height, width, exits, name, multiplier) {
      this.id = id;
      this.name = 'map ' + id;
      this.height = height || 9;
      this.width = width || 9;
      this.exits = exits || 4;
      this.multiplier = multiplier || 1;

      var mapObj = new Map(this.height, this.width, this.multiplier, this.exits);
      this.spriteMap = mapObj.spriteMap;
      this.walkableMap = mapObj.walkableMap;

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

        var sprites = _.flatten(this.spriteMap).join('');
        json.sprites = new Buffer(sprites).toString('base64');

        var walkable = _.flatten(this.walkableMap).join('');
        json.walkable = new Buffer(walkable).toString('base64');

        return json;
      }.call(this));
    };

  Room.prototype.print = function() {
    return this.maze;
  }

  module.exports = Room
})(module || this);
