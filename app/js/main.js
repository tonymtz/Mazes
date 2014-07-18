/* globals requestAnimFrame */
;(function(PIXI, CONFIG, Sockets, Controls, $, io, window) {
  'use strict';

  var Amazeing = (function(){
    var self = {
          container: $('#container'),
          map: null,
          stage: null,
          renderer: null,
          hero: null,
          blockTexture: null,
          otherTexture: null,
          heroTexture: null,
          bounds: {
            height: null,
            width: null
          },
          maze: null,
          player: {
            location: {
              x: CONFIG.start.x,
              y: CONFIG.start.y
            }
          },
          other: {
            data: [],
            render: {}
          }
       };

    self.onUpdateMap = function(data) {
      console.log('rerender');
      self.maze = data;

      for (var index = self.map.children.length - 1; index >= 0; index--) {
        var sprite = self.map.children[index];
        if(sprite.tag === CONFIG.tags.wall || sprite.tag === CONFIG.tags.char) {
          self.map.removeChild(sprite);
        }
      }

      for (var i = 0; i < self.maze.length; i += 1) {
        for (var j = 0; j < self.maze[i].length; j += 1) {
          if (self.maze[i][j].sprite === CONFIG.tags.wall) {
            var wall = new PIXI.Sprite(self.blockTexture);

            wall.height = CONFIG.tile.height;
            wall.width = CONFIG.tile.width;
            wall.position.y = j * CONFIG.tile.height;
            wall.position.x = i * CONFIG.tile.width;
            wall.tag = CONFIG.tags.wall;

            self.map.addChild(wall);
            self.renderer.render(self.stage);
          }
        }
      }

      // Sockets.refresh();
    };

    self.onUpdateOther = function(data) {
      console.log('room players: ', data);
      self.other.data = data;

      self.other.data.forEach(function(obj) {
        var char = null;

        if (self.other.render[obj.id]) {
          char = self.other.render[obj.id];
        } else {
          char = self.other.render[obj.id] = new PIXI.Sprite(self.otherTexture);
          char.height = CONFIG.tile.height;
          char.width = CONFIG.tile.width;
          char.tag = CONFIG.tags.char;

          self.map.addChild(char);
        }

        char.position.y = obj.y * CONFIG.tile.height;
        char.position.x = obj.x * CONFIG.tile.width;
      });
    };

    self.onOtherPlayerEnter = function(data) {
      var character = null;
      if (self.other.render[data.id]) {
        character = self.other.render[data.id];
      } else {
        character = self.other.render[data.id] = new PIXI.Sprite(self.otherTexture);
        character.height = CONFIG.tile.height;
        character.width = CONFIG.tile.width;
        character.tag = CONFIG.tags.character;
        self.map.addChild(character);
      }
      character.position.y = data.location.y * CONFIG.tile.height;
      character.position.x = data.location.x * CONFIG.tile.width;
    };

    self.onOtherPlayerMove = function(data) {
      if (!data) return;
      var character = self.other.render[data.id];
      character.position.y = data.location.y * CONFIG.tile.height;
      character.position.x = data.location.x * CONFIG.tile.width;
    };

    self.onOtherPlayerLeave = function(data) {
      var character = self.other.render[data];
      self.map.removeChild(character);
      delete self.other.render[data];
    };

    self.onUpdatePlayer = function(data) {
      self.player = data;
      self.map.position.x = Math.round(self.bounds.width / 2)-self.player.location.x * CONFIG.tile.height;
      self.map.position.y = Math.round(self.bounds.height / 2)-self.player.location.y * CONFIG.tile.width;

      self.map.visible = true;
    };

    self.updatePlayerSprite = function() {
      self.hero.position.y = self.player.location.y * CONFIG.tile.height;
      self.hero.position.x = self.player.location.x * CONFIG.tile.width;

      self.renderer.render(self.stage);
      requestAnimFrame(self.updatePlayerSprite);
    };

    self.setup = function() {
      self.stage = new PIXI.Stage(0);
      self.map = new PIXI.DisplayObjectContainer();

      self.bounds.height = self.container.height();
      self.bounds.width = self.container.width();

      self.renderer = PIXI.autoDetectRenderer(self.bounds.width, self.bounds.height);

      self.blockTexture = PIXI.Texture.fromImage(CONFIG.maps.block);
      self.otherTexture = PIXI.Texture.fromImage(CONFIG.maps.enemy);
      self.otherTexture.setFrame(new PIXI.Rectangle(0, 0, CONFIG.sprites.width, CONFIG.sprites.height));
      self.otherTexture.noFrame = false;

      self.heroTexture = PIXI.Texture.fromImage(CONFIG.maps.hero);
      self.heroTexture.setFrame(new PIXI.Rectangle(0, 0, CONFIG.sprites.width, CONFIG.sprites.height));
      self.heroTexture.noFrame = false;

      self.hero = new PIXI.Sprite(self.heroTexture);

      self.hero.height = CONFIG.tile.height;
      self.hero.width = CONFIG.tile.width;
      self.hero.position.x = self.player.location.x;
      self.hero.position.y = self.player.location.y;
      self.hero.tag = CONFIG.tags.player;
      self.map.addChild(self.hero);
      self.map.visible = true;

      self.stage.addChild(self.map);

      self.renderer.render(self.stage);

      requestAnimFrame(self.updatePlayerSprite);

      self.container.append(self.renderer.view);
    };

    self.bind = function() {
      Sockets.connector.on('map_rerender', self.onUpdateMap); // done
      Sockets.connector.on('other_enter', self.onOtherPlayerEnter); // done
      Sockets.connector.on('other_leave', self.onOtherPlayerLeave); // done
      Sockets.connector.on('other_move', self.onOtherPlayerMove); //
      Sockets.connector.on('room_players', self.onUpdateOther);
      Sockets.connector.on('player_update', self.onUpdatePlayer);

      // Sockets.connector.on(CONFIG.events.onMapRender, self.onUpdateMap);
      // Sockets.connector.on(CONFIG.events.onPlayerUpdate, self.onUpdatePlayer);
      // Sockets.connector.on(CONFIG.events.onOtherUpdate, self.onUpdateOther);
      Sockets.connect('TestPlayer');
    };

    self.init = function() {
      self.setup();
      self.bind();
    };

    return self;
  }());

  Amazeing.init();
})(PIXI, CONFIG, Sockets, Controls, $, io, window);
