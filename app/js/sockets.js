;(function(io, window) {
  'use strict';

  var Sockets = (function(){
    var self = {
        connector: null
      };

    self.connect = function(playerName) {
      self.connector.emit('connection', playerName);
      self.refresh();
    };

    self.refresh = function(){
       self.connector.emit('need_map');
    };

    self.init = function() {
      self.connector =  io();
    };

    return self;
  }());

  Sockets.init();

  window.Sockets = Sockets;
})(io, window);
