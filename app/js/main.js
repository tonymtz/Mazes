;(function(Phaser, $, window) {
  'use strict';

  var maze,
    game,
    blocks,
    player,
    cursors,
    playerData = {
      vel: 80
    },
    bounds = {
      height: $(window).height(),
      width: $(window).width()
    };

  $.getJSON('/maze', function(data){
    maze = data;
  });

  function drawMap() {
    for (var i = 0; i < 31; i += 1) {
      for (var j = 0; j < 31; j += 1) {
        if (maze[i][j] === 1) {
          // game.add.sprite(i * 32, j * 32, 'block');
          var c = blocks.create(i * 64, j * 64, 'block');
          c.name = 'block' + i + j;
          c.body.immovable = true;
        }
      }
    }
  }

  function preload() {
    game.load.spritesheet('block', 'assets/block2.png', 64, 64);
    game.load.spritesheet('dude', 'assets/dude.png', 16, 16, 60);
    game.load.spritesheet('grass', 'assets/grass2.jpg', 64, 64);
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1984, 1984);
    game.stage.backgroundColor = '#424242';

    game.add.tileSprite(0, 0, 1984, 1984, 'grass');

    blocks = game.add.group();
    blocks.enableBody = true;
    blocks.physicsBodyType = Phaser.Physics.ARCADE;
    drawMap();

    //  The hero!
    player = game.add.sprite(64, 64, 'dude');   //this adds our player to the scene  (xposition, yposition, cachekey)
    game.physics.enable(player); // enable physics for the player (arcade)
    // player.anchor.setTo(0.5,0.5); // set the anchor to the exact middle of the player (good for flipping the image on the same place)
    game.camera.follow(player);   // camera allways center the player
    // player.body.width=16;  // my player image is smaller than the sprite frame size so this is a simple correction of the physicsbody so it does not look weird
    player.body.setSize(12, 16, 2, 0);

    // this adds an animation for later use (custom cachekey, frames used for the animation, frames played per second, loop )
    player.animations.add('stand', [13], 1, false);
    player.animations.add('walk_left', [48,49,48,50], 10, true);
    player.animations.add('walk_right', [36,37,36,38], 10, true);
    player.animations.add('walk_up', [24,25,24,26], 10, true);
    player.animations.add('walk_down', [13,14,13,15], 10, true);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
  }

  function update() {
    game.physics.arcade.collide(player, blocks);
    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);

    if (cursors.left.isDown)
    {
      player.body.velocity.x = -playerData.vel;
      player.animations.play('walk_left');
    }
    else if (cursors.right.isDown)
    {
      player.body.velocity.x = playerData.vel;
      player.animations.play('walk_right');
    }
    else if (cursors.up.isDown)
    {
      player.body.velocity.y = -playerData.vel;
      player.animations.play('walk_up');
    }
    else if (cursors.down.isDown)
    {
      player.body.velocity.y = playerData.vel;
      player.animations.play('walk_down');
    }
    else {
      player.animations.play('stand');
    }

    // var collisionHandler = function() {
    //   console.log('asdsd');
    //   player.body.velocity.setTo(0, 0);
    // };
    // game.physics.arcade.overlap(player, blocks, collisionHandler, null, this);
  }

  function render () {
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
  }

  game = new Phaser.Game(bounds.width, bounds.height, Phaser.AUTO, 'screen', { preload: preload, create: create, update: update, render: render });

})(Phaser, $, window);
