#!/bin/env node
(function(module) {
  'use strict';

  var env = process.env.NODE_ENV || 'development',
    config = require('./config/' + env + '.json'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app);

  app.use(express.static(__dirname + './../build'));

  require('./events')(http);

  http.listen(config.port, function() {
    console.log('There is an Amazeing thing running on %d', http.address().port);
    console.log('Environment: %s', env);
  });
})(module || this);
