/*
 * Phaser's hearts meaning:
 *
 * ♥: Basic functionality
 * ♥♥: Either WebGl or WebAudio enabled
 * ♥♥♥: WebGl and WebAudio enabled
 */
;(function(io) {
  'use strict';

  var connector = io();
  connector.emit('connection', 'pancho');
})(io);
