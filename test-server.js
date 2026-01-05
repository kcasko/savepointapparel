const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is working!\n');
});

server.listen(3004, '0.0.0.0', () => {
  console.log('Test server running on http://localhost:3004');
});

// Keep the process alive
setInterval(() => {
  console.log('Still running...');
}, 5000);
