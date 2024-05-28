const http = require('http');

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  
  
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Autentification Server running on port ${PORT}`));

