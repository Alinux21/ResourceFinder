const resourceController = require('../controllers/resourcesController');

const resourcesRouter = (req,res) =>{

    console.log(req.url);

    if(req.url === '/api/resources' && req.method === 'GET'){
        console.log('get all resources');
        resourceController.getAllResources(req,res);
    }else if(req.url.match(/\/api\/resources\/([0-9-]+)/) && req.method === 'GET'){
        resourceController.getResource(req,res,req.url.split('/')[3]);
    }else if(req.url === '/api/resources' && req.method === 'POST'){
        resourceController.createResource(req,res);
    }else if(req.url.match(/\/api\/resources\/([0-9-]+)/) && req.method === 'PUT'){
        resourceController.updateResource(req,res,req.url.split('/')[3]);
    }else if(req.url.match(/\/api\/resources\/([0-9-]+)/) && req.method === 'DELETE'){
        resourceController.deleteResource(req,res,req.url.split('/')[3]);
    }
    else{
            res.writeHead(404, {'Content-type':'application/json' })
            res.end(JSON.stringify({message: 'Route not found '}))
    }
    
};

module.exports = resourcesRouter;