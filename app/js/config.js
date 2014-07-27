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
      char: 'char_01',
      item: 'item_01',
      mob: 'mon_01',
      mvp: 'mvp_01',
      npc: 'npc_01',
      player: 'player_01',
      wall: 'wall_01',
      warp: 'warp_01'
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
      onPlayerMove: 'player_move',
      onPlayerUpdate: 'player_update',
      onPlayerDrop: 'player_drop',
      onOtherPlayerEnter: 'other_enter',
      onOtherPlayerLeave: 'other_leave',
      onOtherPlayerMove: 'other_move',
      onRoomPlayersList: 'room_players'
    },
    intervals: {
      keyInterval: 150
    },
    world: {
      cave: {
        background: 75,
        wall: 79
      },
      desert: {
        background: 384,
        wall: 1063
      },
      dungeon: {
        background: 202,
        wall: 26
      },
      forest: {
        background: 72,
        wall: 1062
      },
      mountain: {
        background: 339,
        wall: 1063
      },
      snow: {
        background: 387,
        wall: 291
      }
    }
  });

  window.CONFIG = CONFIG;
})(window);
