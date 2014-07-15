/* globals requestAnimFrame */
;(function(PIXI, CONFIG, Sockets, Controls, $, io, window) {
  'use strict';

  var Amazeing = (function(){
    var self = {
          stage: null,
          renderer: null,
          hero: null,
          blockTexture: null,
          otherTexture: null,
          heroTexture: null,
          bounds: {
            height: $(window).height(),
            width: $(window).width()
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
      self.maze = data;

      for (var index = self.stage.children.length - 1; index >= 0; index--) {
        var sprite = self.stage.children[index];
        if(sprite.tag === CONFIG.tags.wall || sprite.tag === CONFIG.tags.char) {
          self.stage.removeChild(sprite);
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

            self.stage.addChild(wall);
            self.renderer.render(self.stage);
          }
        }
      }
    };

    self.onUpdateOther = function(data) {
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

          self.stage.addChild(char);
        }

        char.position.y = obj.y * CONFIG.tile.height;
        char.position.x = obj.x * CONFIG.tile.width;
      });
    };

    self.onUpdatePlayer = function(data) {
      self.player = data;
    };

    self.updatePlayerSprite = function() {
      self.hero.position.y = self.player.location.y * CONFIG.tile.height;
      self.hero.position.x = self.player.location.x * CONFIG.tile.width;

      self.renderer.render(self.stage);
      requestAnimFrame(self.updatePlayerSprite);
    };

    self.setup = function() {
      self.stage = new PIXI.Stage(0);
      self.renderer = PIXI.autoDetectRenderer(self.bounds.width, self.bounds.height);

      self.blockTexture = PIXI.Texture.fromImage(CONFIG.maps.block);
      self.otherTexture = PIXI.Texture.fromImage(CONFIG.maps.enemy);
      self.heroTexture = PIXI.Texture.fromImage(CONFIG.maps.hero);

      self.otherTexture.setFrame(new PIXI.Rectangle(0, 0, CONFIG.sprites.width, CONFIG.sprites.height));
      self.otherTexture.noFrame = false;

      self.heroTexture.setFrame(new PIXI.Rectangle(0, 0, CONFIG.sprites.width, CONFIG.sprites.height));
      self.heroTexture.noFrame = false;

      self.hero = new PIXI.Sprite(self.heroTexture);

      self.hero.height = CONFIG.tile.height;
      self.hero.width = CONFIG.tile.width;
      self.hero.position.x = self.player.location.x;
      self.hero.position.y = self.player.location.y;
      self.hero.tag = CONFIG.tags.player;
      self.stage.addChild(self.hero);

      self.renderer.render(self.stage);

      Sockets.connector.on(CONFIG.events.onMapRender, self.onUpdateMap);
      Sockets.connector.on(CONFIG.events.onPlayerUpdate, self.onUpdatePlayer);
      Sockets.connector.on(CONFIG.events.onOtherUpdate, self.onUpdateOther);
    };

    self.init = function() {
      self.setup();

      requestAnimFrame(self.updatePlayerSprite);

      $('#screen').append(self.renderer.view);

      Sockets.connect('TestPlayer');
    };

    return self;
  }());

  Amazeing.init();
})(PIXI, CONFIG, Sockets, Controls, $, io, window);
