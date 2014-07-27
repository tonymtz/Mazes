/*
 * Phaser's hearts meaning:
 *
 * ♥: Basic functionality
 * ♥♥: Either WebGl or WebAudio enabled
 * ♥♥♥: WebGl and WebAudio enabled
 */
;(function(Phaser, CONFIG, Sockets, Controls, $) {
  'use strict';

  function nextInt(max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min) + min);
  }

  var Amazeing = (function(){
    var self = {
          background: null,
          blocks: null,
          bounds: {
            height: null,
            width: null
          },
          container: $('#container'),
          cursors: null,
          fx: null,
          game: null,
          items: null,
          maze: null,
          other: {
            data: [],
            render: {}
          },
          player: null,
          playerData: {
            type: null,
            location: {
              x: CONFIG.start.x,
              y: CONFIG.start.y
            },
            speed: 80,
            facing: 'down',
            inTween: false
          }
        };

    self.onUpdateMap = function(data) {
      if(data) {
        self.maze = data;
        var map = window.atob(self.maze.cells),
          tileset = self.maze.tileset;

        console.log('Updating map...');

        if(self.blocks) {
          self.blocks.removeAll();
        }

        var pointer = 0;
        for (var i = 0; i < self.maze.width; i += 1) {
          for (var j = 0; j < self.maze.height; j += 1) {
            var block = map.charAt(pointer++),
              tile = CONFIG.world[tileset],
              decorate = tile.enableDecoration;

            var addSprite = function (frame) {
              self.blocks.create(i * CONFIG.tile.width, j * CONFIG.tile.height, 'world', frame);
            };

            if (block === '1') {
              if (decorate && tile.wallBackground) addSprite(tile.wallBackground);
              addSprite(tile.wall);
              if (decorate && !nextInt(20) % 20) {
                addSprite(tile.wallDecoration[nextInt(tile.wallDecoration.length)]);
              }
            } else if (block === '2') {
              addSprite(tile.corridor);
              if (decorate && !nextInt(20) % 20) {
                addSprite(tile.corridorDecoration[nextInt(tile.corridorDecoration.length)]);
              }
            } else if (block === '3') {
              addSprite(tile.room);
              if (decorate && !nextInt(20) % 20) {
                addSprite(tile.roomDecoration[nextInt(tile.roomDecoration.length)]);
              }
            } else if (block === '9') {
              addSprite(tile.corridor);
              addSprite(tile.door);
            }
          }
        }

        self.game.world.bringToTop(self.player);

        self.background.loadTexture('world', CONFIG.world[tileset].background);
        self.game.physics.arcade.collide(self.player, self.blocks);
        Sockets.connector.emit('need_player');
      }
    };

    var once = true; // TODO - Ugly hack, see comment below
    self.onPlayerUpdate = function(data) {
      if (data.location) {
        var thisTween = self.game.add.tween(self.player).to(
          {
            y: data.location.y * CONFIG.tile.height,
            x: data.location.x * CONFIG.tile.width
          },
          200, Phaser.Easing.linear, true, 0, false, false
        );
        thisTween.onStart.add(function(){
          self.playerData.inTween = true;
        });
        thisTween.onComplete.add(function(){
          self.playerData.inTween = false;
          if(!window.Controls.isMoving){
            self.player.animations.stop();
          }
        });

        if (self.playerData.location.x < data.location.x) {
          self.player.animations.play('walk_right');
          self.playerData.facing = 'right';
        } else if (self.playerData.location.x > data.location.x) {
          self.player.animations.play('walk_left');
          self.playerData.facing = 'left';
        } else if (self.playerData.location.y < data.location.y) {
          self.player.animations.play('walk_down');
          self.playerData.facing = 'down';
        } else if (self.playerData.location.y > data.location.y) {
          self.player.animations.play('walk_up');
          self.playerData.facing = 'up';
        } else {
          self.player.animations.play('stand');
        }

        self.playerData.location = data.location;
        self.playerData.id = data.id;
        self.playerData.type = data.type;

        if (once) {
          /*
           * This need to be replaced by play animations instead of add animations forever.
           * Or need to destroy sprite before adding new animations...
           */
          self.player.animations.add('stand', CONFIG.player[self.playerData.type].stand, 1, false);
          self.player.animations.add('walk_left', CONFIG.player[self.playerData.type].walkLeft, 10, true);
          self.player.animations.add('walk_right', CONFIG.player[self.playerData.type].walkRight, 10, true);
          self.player.animations.add('walk_up', CONFIG.player[self.playerData.type].walkUp, 10, true);
          self.player.animations.add('walk_down', CONFIG.player[self.playerData.type].walkDown, 10, true);
          once = false;
        }
      }
    };

    self.onPlayerPushing = function(pushing, key) {
      pushing = pushing || false;
      key = key || 'down';
      if(pushing) {
        switch(key){
          case 37: self.playerData.facing = 'left'; break;
          case 38: self.playerData.facing = 'up'; break;
          case 39: self.playerData.facing = 'right'; break;
          case 40: self.playerData.facing = 'down'; break;
        }
        switch(self.playerData.facing){
          case 'right': self.player.animations.play('walk_right'); break;
          case 'left': self.player.animations.play('walk_left'); break;
          case 'down': self.player.animations.play('walk_down'); break;
          case 'up': self.player.animations.play('walk_up'); break;
        }
      } else {
          self.player.animations.stop();
      }
    };

    self.preload = function() {
      self.game.load.spritesheet('block', 'assets/block.png', 64, 64);
      self.game.load.spritesheet('grass', 'assets/grass.png', 64, 64);
      self.game.load.spritesheet('dude', 'assets/dude.png', 16, 16, 60);
      self.game.load.spritesheet('boom', 'assets/boom.png', 32, 32);
      self.game.load.spritesheet('coin', 'assets/coin.png', 32, 32);
      self.game.load.spritesheet('wall', 'assets/wall.png', 16, 16);

      // Pixi engine has a bug, we cannot load a image with size different to x^2
      self.game.load.spritesheet('world', 'assets/tileset_world_32.png', 32, 32, 2048);
      self.game.load.spritesheet('player', 'assets/tileset_player_32.png', 32, 32, 96);
    };

    self.setupFX = function(effect) {
      effect.animations.add('boom');
      effect.play('boom');
    };

    self.create = function() {
      self.game.physics.startSystem(Phaser.Physics.ARCADE);
      self.game.world.setBounds(0, 0, 1984, 1984);
      self.game.stage.backgroundColor = '#424242';

      self.background = self.game.add.tileSprite(0, 0, 1984, 1984, 'world', CONFIG.world.forest.background);

      self.player = self.game.add.sprite(32, 32, 'player');
      self.game.physics.enable(self.player);
      self.game.camera.follow(self.player);
      self.player.body.setSize(12, 16, 2, 0);
      self.player.bringToTop();

      self.blocks = self.game.add.group();
      self.blocks.enableBody = true;
      self.blocks.physicsBodyType = Phaser.Physics.ARCADE;

      self.items = self.game.add.sprite(10, 10, 'coin');
      self.items.animations.add('spin');
      self.items.animations.play('spin', 10, true);

      self.fx = self.game.add.group();
      self.fx.createMultiple(10, 'boom');
      self.fx.forEach(self.setupFX, this);

      self.bind();
    };

    self.update = function() {
      // nothing to do here!
      self.game.physics.arcade.collide(self.player, self.blocks);
      self.player.body.velocity.setTo(0, 0);
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
      Sockets.connector.on(CONFIG.events.onMapRender, self.onUpdateMap); // this is not loaded!
      Sockets.connector.on(CONFIG.events.onPlayerUpdate, self.onPlayerUpdate);
      Sockets.connector.on(CONFIG.events.onOtherPlayerEnter, self.onOtherPlayerEnter);
      Sockets.connector.on(CONFIG.events.onOtherPlayerLeave, self.onOtherPlayerLeave);
      Sockets.connector.on(CONFIG.events.onOtherPlayerMove, self.onOtherPlayerMove);
      Sockets.connector.on(CONFIG.events.onRoomPlayersList, self.onRoomPlayersList);

      Sockets.connect('TestPlayer');
    };

    self.init = function() {
      self.bounds.height = self.container.height();
      self.bounds.width = self.container.width();

      self.game = new Phaser.Game(
        self.bounds.width,
        self.bounds.height,
        Phaser.CANVAS, // Another bug here, WebGL is running into issues when trying to load a texture for tileSprite
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
  window.Amazeing = Amazeing;
})(Phaser, CONFIG, Sockets, Controls, $);
