var cheerio = require('cheerio');
var superagent = require('superagent');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Eventproxy = require('eventproxy');
var ep = new Eventproxy();
var crawlerUtil = require('./crawlerUtil');


exports.Crawler = function(url) {
	var self = this;

	self.url = url; ////https://segmentfault.com/news

	return function() {
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


exports.CrawlerMore = function(http,content,num) {

	return function() {
		return new Promise(function(resolve, reject) {
			
			var articleUrlArr = [];
			for (var i = 1; i < num; i++) {
				articleUrlArr.push("https://github.com/search?p=" + i + "&q="+ content +"&type=Repositories&utf8=%E2%9C%93");
			}

			articleUrlArr.forEach(function(url) {
				superagent.get(url).end(function(err, res) {
					var charset = "utf-8";
					var arr = res.text.toString().match(/<meta([^>]*?)>/g);
					if (arr) {
						arr.forEach(function(val) {
							var match = val.match(/charset\s*=\s*(.+)\"/);
							if (match && match[1]) {
								if (match[1].substr(0, 1) == '"') match[1] = match[1].substr(1);
								charset = match[1].trim();
								return false;
							}
						})
					}
					var data = require('iconv-lite').decode(res.text, charset)
					ep.emit('task', [url, data]);
				});;
			});
			ep.after('task', articleUrlArr.length, function(data) {
				// data为一个数组，包含了40次ep.emit('task', pair)中的pair
				var objArr = [];

				data.forEach(function(topicPair) {

					// 接下来都是 jquery 的用法了
					var url = topicPair[0];
					var html = topicPair[1];
					var $ = cheerio.load(html);
					var obj = {}
					$('.v-align-middle').each(function(index, el) {
						var link = http ? http + $(this).attr('href') : $(this).attr('href');
						obj.title = $(this).text().trim();
						obj.url = link;
					});
					$('.text-gray').each(function(index, el) {
						obj.comment = $(this).text().trim();
						objArr.push(obj)
					});
				});
				resolve(objArr);
			});
		});
	}

}