;(function(KeyboardJS, Sockets, window) {
  'use strict';


// Keyboard input with customisable repeat (set to 0 for no key repeat)
function KeyboardController(keys, repeat) {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers= {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};

var Controls = (function(){
    var self = {
      onPlayerMove: CONFIG.events.onPlayerMove
    };
    KeyboardController({
        37: function() { Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.left); },
        38: function() { Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.up); },
        39: function() { Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.right); },
        40: function() { Sockets.connector.emit(self.onPlayerMove, CONFIG.keys.down); }
    }, 150);

    self.init = function() {
      KeyboardJS.on(CONFIG.keys.up, self.onKeyUp);
      KeyboardJS.on(CONFIG.keys.right, self.onKeyRight);
      KeyboardJS.on(CONFIG.keys.down, self.onKeyDown);
      KeyboardJS.on(CONFIG.keys.left, self.onKeyLeft);
    };

    return self;
  }()).init();

  window.Controls = Controls;
})(KeyboardJS, Sockets, window);
