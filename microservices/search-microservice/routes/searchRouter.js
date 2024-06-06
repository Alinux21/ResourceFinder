const searchController = require('../controllers/searchController');

const searchRouter = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const match = url.pathname.match(/\/api\/words\/([a-zA-Z0-9-_. (){}\[\]!@#$%^&~]+)/);

    if (match && req.method === 'GET') {
        console.log('searchRouter: ', req.url);
        const query = match[1];
        const limit = parseInt(url.searchParams.get('limit'), 10) || 10; // Default limit to 10
        const offset = parseInt(url.searchParams.get('offset'), 10) || 0; // Default offset to 0
        searchController.searchAlgorithm(req, res, query, limit, offset);
    } else {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found ' }));
    }
}

module.exports = searchRouter;