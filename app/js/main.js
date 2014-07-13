/* globals requestAnimFrame */
;(function(PIXI, CONFIG, Sockets, Controls, $, io, window) {
  'use strict';

  var Amazeing = (function(){
    var self = {
          $container: null,
          $windows: null,
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

      for (var i = 0; i < self.maze.length; i += 1) {
        for (var j = 0; j < self.maze[i].length; j += 1) {
          if (self.maze[i][j].sprite === CONFIG.tags.wall) {
            var newBlock = new PIXI.Sprite(self.blockTexture);

            newBlock.height = CONFIG.tile.height;
            newBlock.width = CONFIG.tile.width;
            newBlock.position.y = j * CONFIG.tile.height;
            newBlock.position.x = i * CONFIG.tile.width;

            self.stage.addChild(newBlock);
            self.renderer.render(self.stage);
          }
        }
      }
    };

    self.onUpdateOther = function(data) {
      self.other.data = data;
      console.log(data);
      self.other.data.forEach(function(obj) {
        var render = null;

        if (self.other.render[obj.id]) {
          render = self.other.render[obj.id];
        } else {
          render = self.other.render[obj.id] = new PIXI.Sprite(self.otherTexture);
          render.height = CONFIG.tile.height;
          render.width = CONFIG.tile.width;
          self.stage.addChild(render);
        }

        render.position.y = obj.y * CONFIG.tile.height;
        render.position.x = obj.x * CONFIG.tile.width;
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
      self.stage.addChild(self.hero);

      self.renderer.render(self.stage);
      requestAnimFrame(self.updatePlayerSprite);

      Sockets.connector.on(CONFIG.events.onMapRender, self.onUpdateMap);
      Sockets.connector.on(CONFIG.events.onPlayerUpdate, self.onUpdatePlayer);
      Sockets.connector.on(CONFIG.events.onOtherUpdate, self.onUpdateOther);
    };

    self.login = function() {
      var $username = $('#userName')[0].value;

      if($username) {
        self.$windows.hide();
        self.$container.append(self.renderer.view);
        Sockets.connect($username);
      }

      return false;
    };

    self.init = function() {
      self.$windows = $('#windows');
      self.$container = $('#screen');
      self.setup();
    };

    return self;
  }());

  $(Amazeing.init);

  window.Amazeing = Amazeing;
})(PIXI, CONFIG, Sockets, Controls, $, io, window);
