var express = require('express');
var fs = require('fs');
var async = require('async');
var router = express.Router();

var Image = require('../models/image');

var multer = require('multer');
var upload = multer({dest: './public/uploads/'});



/**
 * @api {get} /api/posts/ Get all posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiSuccess {Post[]} response A list of posts.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "id": "123456789",
 *              "caption": "Caption for the post",
 *              "author": "Ian McDowell",
 *              "date": "1452794148",
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
    
    if (req.file.mimetype !== 'image/jpeg') {
        console.log('/api/post: wrong image type');
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
    
    fs.rename(req.file.path, req.file.path + '.jpg', function(err) {
        if (err) {
            console.error('/api/post: unable to rename image: ', err);
        }
    });
});

module.exports = router;
