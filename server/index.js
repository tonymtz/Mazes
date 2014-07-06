'use strict';

function nextInt(max) {
  return Math.floor(Math.random() * max);
}

function MazeGenerator(height, width) {
  var maze = [];
  for (var i = 0; i < height; i += 1) {
    maze[i] = [];
    for (var j = 0; j < width; j += 1) {
      maze[i][j] = 1;
    }
  }
  var row = nextInt(height);
  while (row % 2 === 0) {
    row = nextInt(height);
  }
  var column = nextInt(width);
  while (column % 2 === 0) {
    column = nextInt(width);
  }
  maze[row][column] = 0;
  recursion(row, column, maze, height, width);
  return maze;
}

function randomDirections() {
  function shuffle(o){
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }
  var randoms = [];
  for (var i = 0; i < 4; i+=1) {
    randoms.push(i + 1);
  }
  return shuffle(randoms);
}

function recursion(row, col, maze, height, width) {
  var randDirs = randomDirections();
  // var randDirs = [1,2,3,4];
  for (var i = 0; i < randDirs.length; i++) {
    switch (randDirs[i]) {
      case 1: // up
        if (row - 2 < 0) {
          continue;
        }
        if (maze[row - 2][col] !== 0) {
          maze[row - 2][col] = 0;
          maze[row - 1][col] = 0;
          recursion(row - 2, col, maze, height, width);
        }
        break;
      case 2: // right
        if (col + 2 > width - 1) {
          continue;
        }
        if (maze[row][col + 2] !== 0) {
          maze[row][col + 2] = 0;
          maze[row][col + 1] = 0;
          recursion(row, col + 2, maze, height, width);
        }
        break;
      case 3: // down
        if (row + 2 > height - 1) {
          continue;
        }
        if (maze[row + 2][col] !== 0) {
          maze[row + 2][col] = 0;
          maze[row + 1][col] = 0;
          recursion(row + 2, col, maze, height, width);
        }
        break;
      case 4: // left
        if (col - 2 <= 0) {
          continue;
        }
        if (maze[row][col - 2] !== 0) {
          maze[row][col - 2] = 0;
          maze[row][col - 1] = 0;
          recursion(row, col - 2, maze, height, width);
        }
        break;
    }
  }
}

var express = require('express'),
  app = express(),
  port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/maze', function(req, res){
  var maze = new MazeGenerator(31, 31);
  res.jsonp(maze);
});

app.use(express.static(__dirname + './../build'));

var server = app.listen(port, ip, function() {
  console.log('Listening on port %d', server.address().port);
});
