;(function(KeyboardJS, Sockets, window) {
  'use strict';

  var Controls = function(){
    var self = {
      onPlayerMove: CONFIG.events.onPlayerMove
    };

    self.onKeyUp = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.up);
    };

    self.onKeyRight = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.right);
    };

    self.onKeyDown = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.down);
    };

    self.onKeyLeft = function() {
      Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.left);
    };

    self.init = function() {
      KeyboardJS.on(CONFIG.keys.up, self.onKeyUp);
      KeyboardJS.on(CONFIG.keys.right, self.onKeyRight);
      KeyboardJS.on(CONFIG.keys.down, self.onKeyDown);
      KeyboardJS.on(CONFIG.keys.left, self.onKeyLeft);
    };

    return self;
  }().init();

  window.Controls = Controls;
})(KeyboardJS, Sockets, window);
