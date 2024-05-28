const http = require('http');

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Received body:', body);});
  }
  
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Autentification Server running on port ${PORT}`));

