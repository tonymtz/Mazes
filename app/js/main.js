/* globals requestAnimFrame */
;(function(Phaser, CONFIG, Sockets, Controls, $, io, window) {
  'use strict';

  var Amazeing = (function(){
    var self = {
          container: $('#container'),
          maze: null,
          game: null,
          blocks: null,
          cursors: null,
          bounds: {
            height: null,
            width: null
          },
          player: null,
          playerData: {
            location: {
              x: CONFIG.start.x,
              y: CONFIG.start.y
            },
            speed: 80
          },
          other: {
            data: [],
            render: {}
          }
        };

    self.onUpdateMap = function(data) {
      console.log('Drawing map...');

      self.maze = data;

      if(self.maze) {
        for (var i = 0; i < self.maze.length; i += 1) {
          for (var j = 0; j < self.maze[i].length; j += 1) {
            if (self.maze[i][j].sprite === CONFIG.tags.wall) {
              var c = self.blocks.create(i * 64, j * 64, 'block');
              c.name = 'block' + i + j;
              c.body.immovable = true;
            }
          }
        }
      }
    };

    self.onPlayerUpdate = function(data) {
      if (data.location) {
        if (self.playerData.location.x < data.location.x) {
          self.player.animations.play('walk_right');
        } else if (self.playerData.location.x > data.location.x) {
          self.player.animations.play('walk_left');
        } else if (self.playerData.location.y < data.location.y) {
          self.player.animations.play('walk_down');
        } else if (self.playerData.location.y > data.location.y) {
          self.player.animations.play('walk_up');
        } else {
          self.player.animations.play('stand');
        }

        self.playerData = data;
      }
    };

    self.preload = function() {
      self.game.load.spritesheet('block', 'assets/block.png', 64, 64);
      self.game.load.spritesheet('grass', 'assets/grass.png', 64, 64);
      self.game.load.spritesheet('dude', 'assets/dude.png', 16, 16, 60);
    };

    self.create = function() {
      self.game.physics.startSystem(Phaser.Physics.ARCADE);
      self.game.world.setBounds(0, 0, 1984, 1984);
      self.game.stage.backgroundColor = '#424242';

      self.game.add.tileSprite(0, 0, 1984, 1984, 'grass');

      self.blocks = self.game.add.group();
      self.blocks.enableBody = true;

      self.player = self.game.add.sprite(64, 64, 'dude');
      self.game.physics.enable(self.player);
      self.game.camera.follow(self.player);
      self.player.body.setSize(12, 16, 2, 0);

      self.player.animations.add('stand', [13], 1, false);
      self.player.animations.add('walk_left', [48,49,48,50], 10, true);
      self.player.animations.add('walk_right', [36,37,36,38], 10, true);
      self.player.animations.add('walk_up', [24,25,24,26], 10, true);
      self.player.animations.add('walk_down', [13,14,13,15], 10, true);

      self.bind();
    };

    self.update = function() {
      self.game.physics.arcade.collide(self.player, self.blocks);

      if(self.playerData) {
          self.player.x = self.playerData.location.x * CONFIG.tile.width;
          self.player.y = self.playerData.location.y * CONFIG.tile.height;
      }
    };

    self.render = function() {
      // Nothing to do here!
    };

    self.onOtherPlayerEnter = function(data) {
      console.log('onOtherPlayerEnter', data);
    };

    self.onOtherPlayerLeave = function(data) {
      console.log('onOtherPlayerLeave', data);
    };

    self.onOtherPlayerMove = function(data) {
      console.log('onOtherPlayerMove', data);
    };

    self.onRoomPlayersList = function(data) {
      console.log('onRoomPlayersList', data);
    };

    self.bind = function() {
      Sockets.connect('TestPlayer');
      Sockets.connector.on(CONFIG.events.onMapRender, self.onUpdateMap);
      Sockets.connector.on(CONFIG.events.onPlayerUpdate, self.onPlayerUpdate);
      Sockets.connector.on(CONFIG.events.onOtherPlayerEnter, self.onOtherPlayerEnter); // done
      Sockets.connector.on(CONFIG.events.onOtherPlayerLeave, self.onOtherPlayerLeave); // done
      Sockets.connector.on(CONFIG.events.onOtherPlayerMove, self.onOtherPlayerMove); //
      Sockets.connector.on(CONFIG.events.onRoomPlayersList, self.onRoomPlayersList);
    };

    self.init = function() {
      self.bounds.height = self.container.height();
      self.bounds.width = self.container.width();

      self.game = new Phaser.Game(
        self.bounds.width,
        self.bounds.height,
        Phaser.AUTO,
        'container',
        {
          preload: self.preload,
          create: self.create,
          update: self.update,
          render: self.render
        }
      );
    };

    return self;
  }());

  Amazeing.init();
})(Phaser, CONFIG, Sockets, Controls, $, io, window);
