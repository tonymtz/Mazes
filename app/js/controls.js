;(function(Sockets, window) {
  'use strict';

  var Controls = (function(){
    var self = {
      onPlayerMove: CONFIG.events.onPlayerMove,
      keys: null,
      isMoving: false,
      timers: []
    };

    self.moveLeft = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.left);
    };

    self.moveRight = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.right);
    };

    self.moveUp = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.up);
    };

    self.moveDown = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.down);
    };

    self.onKeyDown = function(event) {
      var key = (event || window.event).keyCode;

      if (!(key in self.keys)) {
        return true;
      }

      if (!(key in self.timers)) {
        self.timers[key] = null;
        self.keys[key]();

        if (CONFIG.intervals.keyInterval  !== 0) {
          self.timers[key] = setInterval(self.keys[key], CONFIG.intervals.keyInterval);
          self.isMoving = true;
          window.Amazeing.onPlayerPushing(self.isMoving, key);
        }
      }
      return false;
    };

    self.onKeyUp = function(event) {
      var key= (event || window.event).keyCode;

      if (key in self.timers) {
        if (self.timers[key] !== null) {
          clearInterval(self.timers[key]);
        }

        delete self.timers[key];
      }
      self.isMoving = !$.isEmptyObject(self.timers);
      
      if(!self.isMoving) {
        window.Amazeing.onPlayerPushing(false);
      }

    };

    self.onBlur = function() {
      for (var key in self.timers) {
        if (self.timers[key] !== null) {
          clearInterval(self.timers[key]);
        }
      }

      self.timers = {};
    };

    self.init = function() {
      self.keys = {
        37: self.moveLeft,
        38: self.moveUp,
        39: self.moveRight,
        40: self.moveDown
      };

      document.onkeydown = self.onKeyDown;
      document.onkeyup = self.onKeyUp;
      window.onblur = self.onBlur;
    };

    return self;
  }());

  Controls.init();

  window.Controls = Controls;
})(Sockets, window);
