const http = require('http');
const searchRouter = require('./routes/searchRouter');

const server = http.createServer((req, res) => {
    searchRouter(req, res);
});

const PORT = process.env.PORT || 5004;
server.listen(PORT, () =>
  console.log(`Searg Server running on port ${PORT}`));

