const Resource = require('../models/resourcesModel');
const { getPostData } = require('../utils')


async function getAllResources(req, res) {
    try {
        const resources = await Resource.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(resources))

    } catch (error) {
        console.log(error)
    }
}

async function getResource(req, res, id) {
    try {
        const resources = await Resource.findById(id)

        if (resources.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: "Resource not found!" }));
        } else {

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(resources))
        }
    } catch (error) {
        console.log(error)
    }
}



async function createResource(req, res) {
    try {

        const multer = require('multer');
        const upload = multer();

        upload.any()(req, res, async (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error');
                return;
            }

            console.log('Files:', req.files);


            const { id, title, summary, description
                , tags, link, posted_by, image_src
                , is_book
                , is_online_book
                , is_course
                , is_framework
                , is_visual_programming_language
                , is_sound_programming_language
                , is_web_programming_library
                , is_hardware
                , is_video
                , is_tutorial
                , is_machine_learning
                , is_blog } = JSON.parse(req.body.data);

            const resource = {
                id, title, summary, description
                , tags, link, posted_by, image_src
                , is_book, is_online_book
                , is_course, is_framework
                , is_visual_programming_language
                , is_sound_programming_language
                , is_web_programming_library
                , is_hardware
                , is_video
                , is_tutorial
                , is_machine_learning
                , is_blog
            }


            const newResource = await Resource.create(resource)

            const response = Resource.saveImage(req.files[0]);

            if (response) {
                console.log('Image saved successfully');
            } else {
                console.log('Error saving image');
            }

            res.writeHead(201, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(newResource))
        });
    } catch (error) {
        console.log(error)
    }
}

async function updateResource(req, res, id) {

    try {

        const multer = require('multer');
        const upload = multer();

        upload.any()(req, res, async (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error');
                return;
            }

            console.log('Files:', req.files);

            const resource = await Resource.findById(id);

            if (resource.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Resource not found' }))
            } else {

                const { title, summary, description
                    , tags, link, posted_by, image_src
                    , is_book
                    , is_online_book
                    , is_course
                    , is_framework
                    , is_visual_programming_language
                    , is_sound_programming_language
                    , is_web_programming_library
                    , is_hardware
                    , is_video
                    , is_tutorial
                    , is_machine_learning
                    , is_blog } = JSON.parse(req.body.data);

                const resourceData = {

                    title: title || resource.title
                    , summary: summary || resource.summary
                    , description: description || resource.description
                    , tags: tags || resource.tags
                    , link: link || resource.link
                    , posted_by: posted_by || resource.posted_by
                    , image_src: image_src || resource.image_src
                    , is_book: is_book || resource.is_book
                    , is_online_book: is_online_book || resource.is_online_book
                    , is_course, is_framework: is_framework || resource.is_framework
                    , is_visual_programming_language: is_visual_programming_language || resource.is_visual_programming_language
                    , is_sound_programming_language: is_sound_programming_language || resource.is_sound_programming_language
                    , is_web_programming_library: is_web_programming_library || resource.is_web_programming_library
                    , is_hardware: is_hardware || resource.is_hardware
                    , is_video: is_video || resource.is_video
                    , is_tutorial: is_tutorial || resource.is_tutorial
                    , is_machine_learning: is_machine_learning || resource.is_machine_learning
                    , is_blog: is_blog || resource.is_blog
                }

                const updatedResource = await Resource.update(id, resourceData);

                const response = Resource.saveImage(req.files[0]);

                if (response) {
                    console.log('Image saved successfully');
                } else {
                    console.log('Error saving image');
                }

                res.writeHead(201, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(updatedResource))
            }
        });

    } catch (error) {
        console.log(error)
    }

}

async function deleteResource(req, res, id) {
    try {
        const resources = await Resource.findById(id)

        if (resources.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: "Resource not found!" }));
        } else {

            await Resource.deleteRes(id);

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: "Resource deleted succesfully!" }))
        }
    } catch (error) {
        console.log(error)
    }
}

async function getImage(req, res, imageName) {

    try {
        const image = await Resource.getImage(imageName, res);

        if (image.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: "Image not found!" }));
        } else {

            res.writeHead(200, { 'Content-Type': 'image/jpg' })
            res.end(image)
        }
    } catch (error) {
        console.log(error)
    }

}

async function getUserResources(req, res, username) {

    try {
        const resources = await Resource.findByUser(username)

        if (resources.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: "Resource not found!" }));
        } else {

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(resources))
        }
    } catch (error) {
        console.log(error)
    }


}

async function importResources(req, res) {
    try {
        const multer = require('multer');
        const upload = multer();
        
        upload.any()(req, res, async (err) => {
            if (err) {
                console.error('Error in multer:', err);
                return;
            }

            if (!req.files || req.files.length === 0) {
                console.error('No file uploaded.');
                return;
            }

            const file = req.files[0];

            // Convert the buffer to a string and parse it as JSON
            const data = file.buffer.toString();
            const jsonData = JSON.parse(data);
            
            // Log the names of the resources
            jsonData.resources.forEach(resource => {
                
               Resource.create(resource);

            });
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Resources imported successfully' }));

    } catch(error) {
        console.log(error);
    }
}

async function getPopularResources(req, res) {
    try {
        const resources = await Resource.findPopularResources();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resources));
    } catch(error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
        console.log(error);
    }
}



module.exports = {
    getAllResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    getImage,
    getUserResources,
    importResources,
    getPopularResources
}