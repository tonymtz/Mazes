#!/bin/env node
require('./server/index');

process.on("uncaughtException", function(err) {
  console.log(err.message)
});
