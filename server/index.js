#!/bin/env node
(function(module) {
  'use strict';

  var config = require('./config/development.json'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app);

  app.use(express.static(__dirname + './../build'));

  require('./events')(http);

  http.listen(config.port, config.ip, function() {
    console.log('There is an Amazeing thing running on %d', http.address().port);
  });
})(module || this);
