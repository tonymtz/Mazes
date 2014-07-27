#!/bin/env node
(function(module) {
  'use strict';

  var cell = {
    blank: 1,
    corridor: 2,
    door: 9,
    room: 3,
    wall: 4
  };

  function nextInt(max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min) + min);
  }

  function nextOddInt(max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min) / 2) * 2 + 1 + min;
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

  function MazeGenerator(height, width, multiplicator, exits) {
    var maze;

    maze = createWorld(height, width);

    var row = nextInt(height);
    while (row % 2 === 0) {
      row = nextInt(height);
    }
    var column = nextInt(width);
    while (column % 2 === 0) {
      column = nextInt(width);
    }
    maze[row][column] = 1;
    generateWorld(row, column, maze, height, width);

    maze = createOpenSpaces(maze, height, width);
    maze = growIt(maze, multiplicator);
    maze = addExit(maze, height, width, exits);

    return maze;
  };

  function createWorld(height, width) {
    var maze = [];

    for (var i = 0; i < height; i += 1) {
      maze[i] = [];
      for (var j = 0; j < width; j += 1) {
        maze[i][j] = cell.blank;
      }
    }

    return maze;
  }

  function createOpenSpaces(maze, height, width) {
    var map = maze.slice(0);

    function addRoom() {
      var room_height = nextOddInt(10, 3),
        room_width = nextOddInt(10, 3),
        random_row = nextInt(height - 3, 1),
        random_column = nextInt(width - 3, 1);

      for (var i = 0; i < room_height; i += 1) {
        if (!map[random_row + i + 1] || map[random_row + i + 2] === 3) break;
        for (var j = 0; j < room_width; j += 1) {
          if (!map[random_row + i][random_column + j + 1] || map[random_row + i][random_column + j + 2] === 3) break;
          map[random_row + i][random_column + j] = cell.room;
        }
      }
    }

    for (var i = 0; i < nextInt((height + width) / 20, 0); i += 1) {
      addRoom();
    }

    return map;
  }

  function generateWorld(row, col, maze, height, width) {
    var randDirs = randomDirections();
    for (var i = 0; i < randDirs.length; i += 1) {
      switch (randDirs[i]) {
        case 1: // up
          if (row - 2 < 0) {
            continue;
          }
          if (maze[row - 2][col] !== cell.corridor) {
            maze[row - 2][col] = cell.corridor;
            maze[row - 1][col] = cell.corridor;
            generateWorld(row - 2, col, maze, height, width);
          }
          break;
        case 2: // right
          if (col + 2 > width - 1) {
            continue;
          }
          if (maze[row][col + 2] !== cell.corridor) {
            maze[row][col + 2] = cell.corridor;
            maze[row][col + 1] = cell.corridor;
            generateWorld(row, col + 2, maze, height, width);
          }
          break;
        case 3: // down
          if (row + 2 > height - 1) {
            continue;
          }
          if (maze[row + 2][col] !== cell.corridor) {
            maze[row + 2][col] = cell.corridor;
            maze[row + 1][col] = cell.corridor;
            generateWorld(row + 2, col, maze, height, width);
          }
          break;
        case 4: // left
          if (col - 2 <= 0) {
            continue;
          }
          if (maze[row][col - 2] !== cell.corridor) {
            maze[row][col - 2] = cell.corridor;
            maze[row][col - 1] = cell.corridor;
            generateWorld(row, col - 2, maze, height, width);
          }
          break;
      }
    }
  }

  function growIt(maze, times) {
    var buffer = [],
      parsedTimes = parseInt(times, 10),
      counter,
      counter2;

    times = isNaN(parsedTimes) ? 1 : parsedTimes;

    for (var i = 0; i < maze.length; i += 1) {
      counter = times;
      while (counter) {
        buffer[i * times + counter - 1] = [];
        counter -= 1;
      }
      for (var j = 0; j < maze[0].length; j += 1) {
        counter = times;
        while (counter) {
          counter2 = times;
          while (counter2) {
            buffer[i * times + counter2 - 1][j * times  + counter - 1] = maze[i][j];
            counter2 -= 1;
          }
          counter -= 1;
        }
      }
    }
    return buffer;
  }

  function addExit(maze, width, height, exits) {
    var map = maze.slice(0);
    var randDirs = randomDirections();
    if (typeof exits !== 'number' || exits > 4) return;
    for (var i = 0; i < exits; i += 1) {
      var xHalf = Math.floor(width / 2);
      var yHalf = Math.floor(height / 2);
      switch (randDirs.pop()) {
        case 1:
          if (maze[xHalf][1] === cell.corridor) maze[xHalf][0] = cell.door;
          break;
        case 2:
          if (maze[xHalf][height - 2] === cell.corridor) maze[xHalf][height - 1] = cell.door;
          break;
        case 3:
          if (maze[1][yHalf] === cell.corridor) maze[0][yHalf] = cell.door;
          break;
        case 4:
          if (maze[width - 2][yHalf] === cell.corridor) maze[width - 1][yHalf] = cell.door;
          break;
      }
    }
    return map;
  }

  module.exports = MazeGenerator;
})(module || this);