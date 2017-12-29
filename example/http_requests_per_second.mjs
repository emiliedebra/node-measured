/* @flow */

// 'use strict';
const metrics = require('..');

const collection = new metrics.Collection('http');

const http = require('http');

const rps = collection.meter('requestsPerSecond');
http.createServer((req, res) => {
  console.error(req.headers['content-length']);
  rps.mark(1);
  res.end('Thanks');
}).listen(8000);

setInterval(() => {
  console.log(collection.toJSON());
}, 1000);
