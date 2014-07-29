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
      height: 32,
      width: 32
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
    player: {
      phantom: {
        stand: [0],
        walkDown: [0, 1, 2, 1],
        walkRight: [3, 4, 5, 4],
        walkUp: [6, 7, 8, 7],
        walkLeft: [9, 10, 11, 10]
      },
      skull: {
        stand: [12],
        walkDown: [12, 13, 14, 13],
        walkRight: [15, 16, 17, 16],
        walkUp: [18, 19, 20, 19],
        walkLeft: [21, 22, 23, 22]
      },
      troll: {
        stand: [24],
        walkDown: [24, 25, 26, 25],
        walkRight: [27, 28, 29, 28],
        walkUp: [30, 31, 32, 31],
        walkLeft: [33, 34, 35, 34]
      },
      gargoyle: {
        stand: [36],
        walkDown: [36, 37, 38, 37],
        walkRight: [39, 40, 41, 40],
        walkUp: [42, 43, 44, 43],
        walkLeft: [45, 46, 47, 46]
      },
      elf: {
        stand: [48],
        walkDown: [48, 49, 50, 49],
        walkRight: [51, 52, 53, 52],
        walkUp: [54, 55, 56, 55],
        walkLeft: [57, 58, 59, 58]
      },
      girl: {
        stand: [60],
        walkDown: [60, 61, 62, 61],
        walkRight: [63, 64, 65, 64],
        walkUp: [66, 67, 68, 67],
        walkLeft: [68, 70, 71, 70]
      },
      death: {
        stand: [72],
        walkDown: [72, 73, 74, 73],
        walkRight: [75, 76, 77, 76],
        walkUp: [78, 79, 80, 79],
        walkLeft: [81, 82, 83, 82]
      },
      boy: {
        stand: [84],
        walkDown: [84, 85, 86, 85],
        walkRight: [87, 88, 89, 88],
        walkUp: [90, 91, 92, 91],
        walkLeft: [93, 94, 95, 94]
      }
    },
    world: {
      cave: {
        enableDecoration: true,
        background: 144,
        corridor: 75,
        corridorDecoration: [1826, 1733],
        door: 966,
        room: 75,
        roomDecoration: [1824, 1825, 1826],
        wall: 1031,
        wallBackground: 75,
        wallDecoration: [1857, 1733]
      },
      desert: {
        enableDecoration: false,
        background: 75,
        door: 966,
        wall: 999
      },
      dungeon: {
        enableDecoration: true,
        background: 191,
        corridor: 202,
        corridorDecoration: [234],
        door: 966,
        room: 140,
        roomDecoration: [172],
        wall: 26,
        wallDecoration: [7]
      },
      forest: {
        enableDecoration: true,
        background: 409,
        corridor: 70,
        corridorDecoration: [1024, 1026, 1056, 1057, 1058],
        door: 966,
        room: 70,
        roomDecoration: [1024, 1026, 1056, 1057, 1058],
        wall: 1062,
        wallBackground: 70,
        wallDecoration: []
      },
      mountain: {
        enableDecoration: true,
        background: 339,
        corridor: 337,
        corridorDecoration: [],
        door: 966,
        room: 337,
        roomDecoration: [996],
        wall: 1063,
        wallBackground: 337,
        wallDecoration: []
      },
      snow: {
        enableDecoration: false,
        background: 387,
        door: 966,
        wall: 291
      }
    }
  });

  window.CONFIG = CONFIG;
})(window);
