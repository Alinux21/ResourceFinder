const searchController = require('../controllers/searchController');

const searchRouter = (req, res) => {
    if(req.url.match(/\/api\/words\/([a-zA-Z0-9-_. (){}\[\]!@#$%^&~]+)/) && req.method === 'GET') {
        console.log('searchRouter: ', req.url);
        searchController.searchAlgorithm(req, res);
    } else {
        res.writeHead(404, { 'Content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route not found ' }))
    }
}

module.exports = searchRouter;