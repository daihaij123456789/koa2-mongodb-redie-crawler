var mongoose = require('mongoose');

//var Classify = mongoose.model('Classify');


var githubLinkSchema = new mongoose.Schema({
	dataId: String,
	title: String, //标题
	url: String, //发布人
	comment: String, //内容
});


module.exports = githubLinkSchema;

