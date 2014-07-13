;(function(window) {
  'use strict';

  var CONFIG = Object.freeze({
    sprites: {
      height: 32,
      width: 32
    },
    start: {
      x: 1,
      y: 1
    },
    tags: {
      wall: 'wall_01'
    },
    tile: {
      height: 16,
      width: 16
    },
    maps: {
      block: 'assets/block.png',
      hero: 'assets/hero.png',
      enemy: 'assets/enemy.png'
    },
    keys: {
      none: '',
      up: 'up',
      left: 'left',
      right: 'right',
      down: 'down'
    },
    events: {
      onMapRender: 'map_rerender',
      onPlayerDrop: 'player_drop',
      onPlayerMove: 'player_move',
      onPlayerUpdate: 'player_update',
      onOtherUpdate: 'other_update'
    }
  });

  window.CONFIG = CONFIG;
})(window);
