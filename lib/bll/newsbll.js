/*
 * @Author: Benson
 * @Date:   2016-10-31 22:38:00
 * @Last Modified by:   Benson
 * @Last Modified time: 2016-11-08 22:39:40
 */

var Promise = require('bluebird');

var Crawler = require('../crawler/crawler');
var mongoose = require('mongoose');
var News = require('../models/news');
var moment = require('moment');

//mongoose默认的mporomise已经被弃用了,这里手动指定mongoose使用的Promise库。则所有操作会返回promise
mongoose.Promise = Promise;

var NewsBll = function() {

	var self = this;

	self.findAllNews = function() { //查询所有最热门的信息
		return News.find({
			"type": "news"
		}).limit(10).exec(function(err, docs) {
			return docs;
		})
	};

	self.findAllNewest = function() { //所有最新的
		return News.find({
			"type": "newest"
		}).limit(10).exec(function(err, docs) {
			return docs;
		})
	};

	self.findByDataId = function(dataId) {
		return News.findOne({
			'dataId': dataId
		}, function(err, doc) {
			return doc;
		});
	}

	self.updateTypeByDataId = function(dataId, type) {
		News.update({
			'dataId': dataId
		}, {
			$set: {
				'type': ['news', 'newest']
			}
		}, function(err) {
			if (err) {
				console.log('error');
			}
		});
	};

	self.saveNews = function(data) {
		//注意此处 和 下面 querydataId 使用let 变量 使用var异步会使值被后面的值覆盖
		for (let i = 0; i < data.length; i++) {
			let querydataId = data[i].dataId;
			self.findByDataId(querydataId).then(function(doc) {

				if (doc) {
					var type = ['news, newest'];
					self.updateTypeByDataId(querydataId, type);
				} else {
					var news = new News();

					news.dataId = data[i].dataId;
					news.title = data[i].title;
					news.publisher = data[i].publisher;
					news.publishTime = data[i].publishTime;
					news.classify.name = data[i].classify.name;
					news.classify.url = data[i].classify.url;
					news.link = data[i].link;
					news.linkText = data[i].linkText;
					news.commentNum = data[i].commentNum;
					news.approvalNum = data[i].approvalNum;
					news.picUrl = data[i].picUrl;
					news.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
					news.type = data[i].type;

					news.save(function(err) {
						if (err) {
							console.log(err);
						}

					});
				}
			})
		}
	}
}

module.exports = NewsBll;