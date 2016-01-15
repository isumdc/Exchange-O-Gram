var express = require('express'); // routing
var router = express.Router();

var fs = require('fs'); // filesystem functions
var async = require('async'); // asynchronous functions
var sharp = require('sharp'); // image manipulation

var Image = require('../models/image'); // image database schema

var multer = require('multer'); // multipart post requests
var upload = multer({dest: './public/uploads/'}); // puts uploaded files in that directory



/**
 * @api {get} /api/posts/ Get all posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiSuccess {Post[]} response A list of posts.
 * @apiSuccess {String} response.id A unique identifier for the post
 * @apiSuccess {String} response.caption The post's caption
 * @apiSuccess {String} response.author The author of the post
 * @apiSuccess {Number} response.date The date (in epoch) that the post was created
 * @apiSuccess {String} response.url The relative URL pointing to the post's image.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "id": "123456789",
 *              "caption": "Caption for the post",
 *              "author": "Ian McDowell",
 *              "date": 1452885927,
 *              "url": "/uploads/asdfgjkl.jpg"
 *          },
 *          ...
 *     ]
 */
router.get('/posts', function(req, res) {
	Image.find({}, function(err, images) {
		var imgs = images.map(function(image) {
			return {
				'id': image._id,
				'caption': image.caption,
				'author': image.author,
				'date': Math.floor(image.date / 1000),
				'url': image.url
			};
		});
		return res.json(imgs);
	});
});


/**
 * @api {post} /api/post Create a post
 * @apiName Post
 * @apiGroup Posts
 *
 * @apiParam {File} image The image with the post
 * @apiParam {String} caption A caption for the post
 * @apiParam {String} author The author of the post
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError ImageNotFound No image was uploaded with the post
 * @apiError IncorrectImageType The image was not in JPEG format.
 * @apiError BadParameters No caption or author was provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "ImageNotFound"
 *     }
 */
router.post('/post', upload.single('image'), function(req, res) {

	if (!req.file) {
		console.log('/api/post: unable to find image');
		return req.status(400).json({'error': 'ImageNotFound'});
	}

	console.log('/api/post: uploaded file: ', req.file);

    sharp(req.file.path)
        .resize(1000,null) // scale it to 500 width, and scale height accordingly
        .toFile(req.file.path + '.jpg', function(err) { 
            if (err) {
                return res.status(400).json({'error': 'IncorrectImageType'});
            }
            
            try {
                fs.unlinkSync('./public/uploads/'+req.file.filename); // remove initial uploaded image
            } catch (error) { }
            
            // .toFile converts the file to jpg
            if (err) {
                return res.status(400).json({'error': 'IncorrectImageType'});
            }
            
            var caption = req.body.caption;
            var author = req.body.author;

            if (!caption || !author) {
                return res.status(400).json({'error': 'BadParameters'});
            }

            var image = new Image();
            image.url = '/uploads/' + req.file.filename + '.jpg';
            image.caption = caption;
            image.author = author;
            image.date = new Date();

            image.save(function(err, image) {
                
                return res.sendStatus(200);
            });
        });
});

module.exports = router;
