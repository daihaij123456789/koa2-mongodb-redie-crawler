var mongoose = require('mongoose');

//var Classify = mongoose.model('Classify');


var NewsSchema = new mongoose.Schema({
	dataId: String,
	title: String, //标题
	publisher: String, //发布人
	publishTime: String, //发布时间
	createTime: Date, //添加时间
	classify: { //分类
		name: String,
		url: String
	},
	link: String, //链接
	linkText: String, //连接文字
	commentNum: Number, //评论数
	approvalNum: Number, //点赞数
	picUrl: String, //图片地址
	type: [String] //news热门的 newest最新的  或者同时存
});


module.exports = NewsSchema;

