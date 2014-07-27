#!/bin/env node
(function(module) {
  'use strict';

  var Block = require('./block');

  function nextInt(max) {
    return Math.floor(Math.random() * max);
  }

  function MazeGenerator(height, width, multiplicator, exits) {
    var maze = [];
    for (var i = 0; i < height; i += 1) {
      maze[i] = [];
      for (var j = 0; j < width; j += 1) {
        maze[i][j] = 2;
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
    maze[row][column] = 1;
    generateWorld(row, column, maze, height, width, 2);

    if (exits > 0 && exits < 5) {
      addExit(maze, width, height, exits);
    }

    maze = growIt(maze, multiplicator);
    // replaceForObjects(maze);
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

  /*
   * @row - number of initial row for generator
   * @row - number of initial col for generator
   * @maze - maze array[[]]
   * @height - maze height
   * @width - maze width
   * @exits - number of exits [1-4]
   */
  function generateWorld(row, col, maze, height, width) {
    var randDirs = randomDirections();
    for (var i = 0; i < randDirs.length; i += 1) {
      switch (randDirs[i]) {
        case 1: // up
          if (row - 2 < 0) {
            continue;
          }
          if (maze[row - 2][col] !== 1) {
            maze[row - 2][col] = 1;
            maze[row - 1][col] = 1;
            generateWorld(row - 2, col, maze, height, width);
          }
          break;
        case 2: // right
          if (col + 2 > width - 1) {
            continue;
          }
          if (maze[row][col + 2] !== 1) {
            maze[row][col + 2] = 1;
            maze[row][col + 1] = 1;
            generateWorld(row, col + 2, maze, height, width);
          }
          break;
        case 3: // down
          if (row + 2 > height - 1) {
            continue;
          }
          if (maze[row + 2][col] !== 1) {
            maze[row + 2][col] = 1;
            maze[row + 1][col] = 1;
            generateWorld(row + 2, col, maze, height, width);
          }
          break;
        case 4: // left
          if (col - 2 <= 0) {
            continue;
          }
          if (maze[row][col - 2] !== 1) {
            maze[row][col - 2] = 1;
            maze[row][col - 1] = 1;
            generateWorld(row, col - 2, maze, height, width);
          }
          break;
      }
    }
  }

  /*
   * @maze - maze array[[]]
   */
  function replaceForObjects(maze) {
    for (var i = 0; i < maze.length; i += 1) {
      for (var j = 0; j < maze.length; j += 1) {
        if (maze[i][j] === 1) {
          maze[i][j] = new Block();
        }
      }
    }
  }

  /*
   * @maze - maze array[[]]
   * @times - how many times the maze will increase
   */
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

  /*
   * @exits - number of exits [1-4]
   */
  function addExit(maze, width, height, exits) {
    var randDirs = randomDirections();
    if (typeof exits !== 'number' || exits > 4) return;
    for (var i = 0; i < exits; i += 1) {
      var xHalf = Math.floor(width / 2);
      var yHalf = Math.floor(height / 2);
      switch (randDirs.pop()) {
        case 1:
          maze[xHalf][0] = 1;
          break;
        case 2:
          maze[xHalf][height - 1] = 1;
          break;
        case 3:
          maze[0][yHalf] = 1;
          break;
        case 4:
          maze[width - 1][yHalf] = 1;
          break;
      }
    }
  }

  module.exports = MazeGenerator;
})(module || this);
