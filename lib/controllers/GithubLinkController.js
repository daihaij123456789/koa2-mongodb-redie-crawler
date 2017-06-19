/*
 * @Author: Benson
 * @Date:   2016-11-01 20:52:31
 * @Last Modified by:   Benson
 * @Last Modified time: 2016-11-06 03:05:03
 */
var GithubLink = require('../bll/githubLinkbll');
var Crawler = require('../crawler/crawler');
var config = require('../config/config');
// var client = require('../config/redis');
var Promise = require('bluebird');
var redis = require('redis');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var client = redis.createClient();

exports.findAllGithubLink = function() { //所有热门的

		// var newsFind = newsbll.findAllNews(); //返回一个promise
		// var crawlerPromise = crawler.crawler();
		var githubLinkbll = new GithubLink();
		return client.getAsync('news')
			.then(function(res) {
				if (res) {
					return res;
				}
				return githubLinkbll.findAllGithubLinkbll();
			})
			.then(function(items) {
				//items来源于上一个then返回的redis中数据,此时数据类型为string 或者 来源于查询数据库中返回的Promise,数据类型为object。所以转换成string类型，用于区分下一个then方法的数据来源
				if (items.length != 0) {
					if (typeof items == 'string') {
						return items;
					}
					return JSON.stringify(items);
				}
				var http = 'https://github.com';
				var crawler = Crawler.CrawlerMore(http,'js',10);
				return crawler();
			})
			.then(function(data) {
				if (typeof data == 'string') { //不是来自于上一个promise的值
					return data;
				}
				// 数据来自于爬虫返回的Promise
				if (data.length != 0) {
					newsbll.saveGithubLinkbll(data);
					return JSON.stringify(data);
				}
			})
			.then(function(data) {
				client.set('githubLinkbll', data);
				return data;
			})
	};


