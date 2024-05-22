const http = require('http');
const resourcesRouter = require('./routes/resourcesRouter');

const server = http.createServer((req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  resourcesRouter(req, res);

});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Resource Microservice Server running on port ${PORT}`));

