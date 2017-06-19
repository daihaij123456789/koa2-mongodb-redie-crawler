/*
 * @Author: Benson
 * @Date:   2016-10-31 22:38:00
 * @Last Modified by:   Benson
 * @Last Modified time: 2016-11-08 22:39:40
 */

var Promise = require('bluebird');

var Crawler = require('../crawler/crawler');
var mongoose = require('mongoose');
var GithubLink = require('../models/githubLink');
var moment = require('moment');

//mongoose默认的mporomise已经被弃用了,这里手动指定mongoose使用的Promise库。则所有操作会返回promise
mongoose.Promise = Promise;

var GithubLinkBll = function() {

	var self = this;

	self.findAllGithubLink = function() { //查询所有最热门的信息
		return GithubLink.find({
		}).limit(10).exec(function(err, docs) {
			return docs;
		})
	};


	self.findByDataId = function(dataId) {
		return GithubLink.findOne({
			'dataId': dataId
		}, function(err, doc) {
			return doc;
		});
	}

	self.updateTypeByDataId = function(dataId, title) {
		GithubLink.update({
			'dataId': dataId
		}, {
			$set: {
				'title': title
			}
		}, function(err) {
			if (err) {
				console.log('error');
			}
		});
	};

	self.saveGithubLink = function(data) {
		//注意此处 和 下面 querydataId 使用let 变量 使用var异步会使值被后面的值覆盖
		for (let i = 0; i < data.length; i++) {
			let querydataId = data[i].dataId;
			self.findByDataId(querydataId).then(function(doc) {

				if (doc) {
					var title = 'title';
					self.updateTypeByDataId(querydataId, title);
				} else {
					var githubLink = new GithubLink();

					githubLink.dataId = data[i].dataId;
					githubLink.title = data[i].title;
					githubLink.url = data[i].url;

					GithubLink.save(function(err) {
						if (err) {
							console.log(err);
						}

					});
				}
			})
		}
	}
}

module.exports = GithubLinkBll;