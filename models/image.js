var mongoose = require('mongoose');

var Image = mongoose.Schema({
	url: String,
	caption: String,
	author: String,
	date: Date
});
module.exports = mongoose.model('Image', Image);
