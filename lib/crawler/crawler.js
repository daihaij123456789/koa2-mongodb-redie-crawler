var cheerio = require('cheerio');
var superagent = require('superagent');

var crawlerUtil = require('./crawlerUtil');
var Promise = require('bluebird');

function Crawler(url) {
	var self = this;

	self.url = url; ////https://segmentfault.com/news

	self.crawler = function() {
		return new Promise(function(resolve, reject) {
			superagent
				.get(self.url)
				.end(function(err, res) {
					if (err) {
						reject(err);
					}
					var items = [];
					var $ = cheerio.load(res.text, {
						normalizeWhitespace: true
					});
					$('.news__list .news__item').each(function(i, elem) {
						var $element = $(elem);
						items.push({
							dataId: $element.find('.news__item-zan').attr('data-id'),
							title: $element.find('.news__item-title a').text(),
							publisher: $element.find('.news__item-meta .mr10').text(),
							publishTime: crawlerUtil.realTime($element.find('.news__item-meta span').text().slice($element.find('.news__item-meta .mr10').text().length).slice(0, -3)),
							classify: crawlerUtil.classifyTrans($element.find('.ml10').text()),
							link: 'https://segmentfault.com' + $element.find('.news__item-external-link').attr('href'),
							linkText: $element.find('.news__item-external-link').text(),
							commentNum: $element.find('.news__item-comment-box').text(),
							approvalNum: $element.find('.news__item-zan-number').text(),
							type: crawlerUtil.getType(self.url),
							picUrl: ''

						});
						resolve(items);
					});
				});
		});
	}
}
module.exports = Crawler;