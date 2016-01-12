var express = require('express');
var async = require('async');
var router = express.Router();

var Image = require('../models/image');

var multer = require('multer');
var upload = multer({dest: 'uploads/'});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/api/posts', function(req, res) {
	Image.find({}, function(err, images) {
		var imgs = images.map(function(image) {
			return {
				'id': image._id,
				'caption': image.caption,
				'author': image.author,
				'date': image.date,
				'url': image.url
			};
		});
		return res.json(imgs);
	});
});

router.post('/api/post', upload.single('image'), function(req, res) {
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
