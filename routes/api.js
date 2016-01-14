var express = require('express');
var async = require('async');
var router = express.Router();

var Image = require('../models/image');

var multer = require('multer');
var upload = multer({dest: '../public/uploads/'});



/**
 * @api {get} /api/posts/ Get all posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiSuccess {Object[]} posts A list of posts.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "id": "123456789",
*               "caption": "Caption for the post",
                "author": "Ian McDowell",
                "date": "1452794148",
                "url": "/uploads/asdfgjkl.jpg"
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
 * @apiGroup Post
 *
 * @apiParam {File} image The image with the post
 * @apiParam {String} caption A caption for the post
 * @apiParam {String} author The author of the post
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError ImageNotFound No image was uploaded with the post
 * @apiError BadParams No caption or author was provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 */
router.post('/post', upload.single('image'), function(req, res) {
	if (!req.files) {
		return res.sendStatus(400);
	}

	var imageUpload = req.files['image'][0];

	if (!imageUpload) {
		return req.sendStatus(400);
	}

	var caption = req.body.caption;
	var author = req.body.author;

	if (!caption || !author) {
		return res.sendStatus(400);
	}

	var image = new Image();
	image.url = '/uploads/'+imageUpload.filename;
	image.caption = caption;
	image.author = author;
	image.date = new Date();

	image.save(function(err, image) {
		return res.sendStatus(200);
	});
});

module.exports = router;
