/* globals requestAnimFrame */
;(function(PIXI, KeyboardJS, $, io, window) {
  'use strict';

  var
    bounds = {
      height: $(window).height(),
      width: $(window).width()
    },
    maze,
    player = {
      location: {
        x: 1,
        y: 1
      }
    },
    other = {
      data: [],
      render: {}
    },
    socket = io();

  socket.on('map_rerender', function(map) {
    maze = map;
    drawMap();
  });

  socket.on('player_update', function(data) {
    player = data;
  });

  socket.on('other_update', function(data) {
    other.data = data;
    drawOther();
  });

  // Controls, powered by KeyboardJS
  KeyboardJS.on('up', function() {
    socket.emit('player_move', 'up');
  });

  KeyboardJS.on('right', function() {
    socket.emit('player_move', 'right');
  });

  KeyboardJS.on('down', function() {
    socket.emit('player_move', 'down');
  });

  KeyboardJS.on('left', function() {
    socket.emit('player_move', 'left');
  });

  var blockTexture = PIXI.Texture.fromImage('assets/block2.png'),
    otherTexture = PIXI.Texture.fromImage('assets/grass.jpg'),
    heroTexture = PIXI.Texture.fromImage('assets/block.png');

  function drawMap() {
    for (var i = 0; i < maze.length; i += 1) {
      for (var j = 0; j < maze[i].length; j += 1) {
        if (maze[i][j].sprite === 'wall_01') {
          var newBlock = new PIXI.Sprite(blockTexture);
          newBlock.height = 16;
          newBlock.width = 16;
          newBlock.position.x = i * 16;
          newBlock.position.y = j * 16;
          stage.addChild(newBlock);
          renderer.render(stage);
        }
      }
    }
  }

  function drawOther() {
    other.data.forEach(function(obj) {
      var render;
      if (other.render[obj.id]) {
        render = other.render[obj.id];
      } else {
        render = other.render[obj.id] = new PIXI.Sprite(otherTexture);
        render.height = 16;
        render.width = 16;
        stage.addChild(render);
      }
      render.position.x = obj.x * 16;
      render.position.y = obj.y * 16;
    });
  }

  var stage = new PIXI.Stage(0);
  var renderer = PIXI.autoDetectRenderer(bounds.width, bounds.height);

  var hero = new PIXI.Sprite(heroTexture);
  hero.height = 16;
  hero.width = 16;
  hero.position.x = player.location.x;
  hero.position.y = player.location.y;
  stage.addChild(hero);

  renderer.render(stage);

  function update() {
    hero.position.x = player.location.x * 16;
    hero.position.y = player.location.y * 16;

    renderer.render(stage);

    requestAnimFrame(update);
  }

  requestAnimFrame(update);

  $('#screen').append(renderer.view);

  socket.emit('connection', 'TonyMtz');
})(PIXI, KeyboardJS, $, io, window);
