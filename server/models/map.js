#!/bin/env node
(function(module) {
  'use strict';

  var
    spriteMap,
    walkableMap,
    sprite = {
      blank: 1,
      corridor: 2,
      door: 9,
      room: 3,
      wall: 4
    },
    walkable = 0,
    notWalkable = 1;

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
    walkableMap = createEmptyMap(walkable, height, width);
    spriteMap = createEmptyMap(sprite.blank, height, width);

    var row = nextInt(height);
    while (row % 2 === 0) {
      row = nextInt(height);
    }
    var column = nextInt(width);
    while (column % 2 === 0) {
      column = nextInt(width);
    }
    walkableMap[row][column] = notWalkable;
    generateWorld(row, column, walkableMap, height, width);

    walkableMap = createOpenSpaces(walkableMap, height, width);
    walkableMap = growIt(walkableMap, multiplicator);
    walkableMap = addExit(walkableMap, height, width, exits);

    return {
      walkableMap: walkableMap,
      spriteMap: spriteMap
    };
  };

  function createEmptyMap(fillWith, height, width) {
    var map = [];

    for (var i = 0; i < height; i += 1) {
      map[i] = [];
      for (var j = 0; j < width; j += 1) {
        map[i][j] = fillWith;
      }
    }

    return map;
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
          map[random_row + i][random_column + j] = sprite.room;
        }
      }
    }

    for (var i = 0; i < nextInt((height + width) / 20, 0); i += 1) {
      addRoom();
    }

    return map;
  }

  function generateWorld(row, column, maze, height, width) {

    var randDirs = randomDirections();
    for (var i = 0; i < randDirs.length; i += 1) {
      switch (randDirs[i]) {
        case 1: // up
          if (row - 2 < 0) {
            continue;
          }
          if (maze[row - 2][column] !== notWalkable) {
            maze[row - 2][column] = notWalkable;
            maze[row - 1][column] = notWalkable;
            generateWorld(row - 2, column, maze, height, width);
          }
          break;
        case 2: // right
          if (column + 2 > width - 1) {
            continue;
          }
          if (maze[row][column + 2] !== notWalkable) {
            maze[row][column + 2] = notWalkable;
            maze[row][column + 1] = notWalkable;
            generateWorld(row, column + 2, maze, height, width);
          }
          break;
        case 3: // down
          if (row + 2 > height - 1) {
            continue;
          }
          if (maze[row + 2][column] !== notWalkable) {
            maze[row + 2][column] = notWalkable;
            maze[row + 1][column] = notWalkable;
            generateWorld(row + 2, column, maze, height, width);
          }
          break;
        case 4: // left
          if (column - 2 <= 0) {
            continue;
          }
          if (maze[row][column - 2] !== notWalkable) {
            maze[row][column - 2] = notWalkable;
            maze[row][column - 1] = notWalkable;
            generateWorld(row, column - 2, maze, height, width);
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
          if (maze[xHalf][1] === sprite.corridor) maze[xHalf][0] = sprite.door;
          break;
        case 2:
          if (maze[xHalf][height - 2] === sprite.corridor) maze[xHalf][height - 1] = sprite.door;
          break;
        case 3:
          if (maze[1][yHalf] === sprite.corridor) maze[0][yHalf] = sprite.door;
          break;
        case 4:
          if (maze[width - 2][yHalf] === sprite.corridor) maze[width - 1][yHalf] = sprite.door;
          break;
      }
    }
    return map;
  }

  module.exports = MazeGenerator;
})(module || this);