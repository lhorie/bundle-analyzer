#!/usr/bin/env node
const fs = require('fs');
const server = require('../server.js');

const dir = process.argv[2];
const analyzer = server.start({dir});

fs.watch(dir, analyzer.update);
