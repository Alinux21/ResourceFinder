const http = require('http');
const logRouter = require('./routes/logRouter');

const server = http.createServer((req, res) => {
    logRouter(req, res);
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () =>
  console.log(`Log user info Server running on port ${PORT}`));

