const http = require('http');
const url = require('url');
const runBot = require('./bot');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === 'bot') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { proxies, targetUrl, numRequests } = JSON.parse(body);
      runBot(proxies, targetUrl, numRequests)
        .then(() => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Bot run successfully' }));
        })
        .catch(error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error running bot', error: error.message }));
        });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
