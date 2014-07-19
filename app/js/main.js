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

    self.onUpdatePlayer = function(data) {
      self.playerData = data;
    };

    self.preload = function() {
      self.game.load.spritesheet('block', 'assets/block.png', 64, 64);
      self.game.load.spritesheet('grass', 'assets/grass.jpg', 64, 64);
      self.game.load.spritesheet('dude', 'assets/dude.png', 16, 16, 60);
    };

    self.create = function() {
      self.game.physics.startSystem(Phaser.Physics.ARCADE);
      self.game.world.setBounds(0, 0, 1984, 1984);
      self.game.stage.backgroundColor = '#424242';

      self.game.add.tileSprite(0, 0, 1984, 1984, 'grass');

      self.blocks = self.game.add.group();
      self.blocks.enableBody = true;
      self.blocks.physicsBodyType = Phaser.Physics.ARCADE;

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
        if(self.player.x < self.playerData.location.x) {
          self.player.animations.play('walk_left');
        } else if(self.player.x > self.playerData.location.x) {
          self.player.animations.play('walk_right');
        } else if(self.player.y < self.playerData.location.y) {
          self.player.animations.play('walk_up');
        } else if(self.player.y > self.playerData.location.y) {
          self.player.animations.play('walk_down');
        }

        self.player.x = self.playerData.location.x * CONFIG.tile.width;
        self.player.y = self.playerData.location.y * CONFIG. tile.height;

      }
    };

    self.render = function() {
      // Nothing to do here!
    };

    self.bind = function() {
      Sockets.connector.on(CONFIG.events.onMapRender, self.onUpdateMap);
      Sockets.connector.on(CONFIG.events.onPlayerUpdate, self.onUpdatePlayer);
      // Sockets.connector.on(CONFIG.events.onOtherUpdate, self.onUpdateOther);
//      Sockets.connector.on('other_enter', self.onOtherPlayerEnter); // done
//      Sockets.connector.on('other_leave', self.onOtherPlayerLeave); // done
//      Sockets.connector.on('other_move', self.onOtherPlayerMove); //
//      Sockets.connector.on('room_players', self.onRoomPlayersList);

      Sockets.connect('TestPlayer');
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
