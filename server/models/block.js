(function(module) {
  'use strict';

  var
    Block = function(hp) {
      this.hp = hp || -1;
      this.type = 'wall';
      this.sprite = 'wall_01';
    },
    Teleport = function() {
      this.type = 'teleport';
      this.sprite = 'teleport';
    };

  Block.prototype.hurt = function(weapon) {
    console.log('hurt by weapon not implemented yet');
    return;
  }

  module.exports = Block;
})(module || this);