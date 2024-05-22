const http = require('http');
const resourcesRouter = require('./routes/resourcesRouter');

const server = http.createServer((req, res) => {

  resourcesRouter(req, res);

});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Resource Microservice Server running on port ${PORT}`));

