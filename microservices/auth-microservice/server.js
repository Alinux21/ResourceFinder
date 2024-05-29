const http = require('http');
const authRouter = require('./routes/authRouter');

const server = http.createServer((req, res) => {
    authRouter(req, res);
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () =>
  console.log(`Autentification Server running on port ${PORT}`));

