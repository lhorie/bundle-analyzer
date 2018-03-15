const fs = require('fs');
const express = require('express');
const getSizes = require('./sizes');
const open = require('opn');

function start({dir, port = 9000}) {
  const connections = new Set();

  const app = express();
  app.get('/', (req, res) => {
    const html = __dirname + '/client.html';
    fs.createReadStream(html).pipe(res);
  });

  app.get('/_sse', async (req, res) => {
    connections.add(res);
    req.connection.addListener('close', () => connections.delete(res));
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    const data = await getSizes(dir);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  const server = app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
  });
  open(`http://localhost:${port}`);

  async function update() {
    const data = await getSizes(dir);
    for (const res of connections) {
      res.write('data: ' + JSON.stringify(data) + '\n\n');
    }
  }

  function close() {
    server.close();
  }

  return {update, close};
}

module.exports = {start, getSizes};
