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


exports.CrawlerMore = function(http) {
	var arrList = [];
	var subArr = [];
	//var dataList = [];

	return function() {
		return new Promise(function(resolve, reject) {
			for (var i = 1; i < 5; i++) {
				arrList.push("https://github.com/search?p=" + i + "&q=js&type=Repositories&utf8=%E2%9C%93")
			}
			arrList.forEach(function(url) {
				var opts = {
					url: url,
					encoding: null,
					mothod: 'GET'
				}
				request(opts).then(function(response) {
					var charset = "utf-8";
					var arr = response.body.toString().match(/<meta([^>]*?)>/g);
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
					var data = require('iconv-lite').decode(response.body, charset)
					ep.emit('task', [url, data]);
				});
			});


			ep.after('task', arrList.length, function(data) {
				var subArr = [];
				var http = 'https://github.com';
				// data为一个数组，包含了40次ep.emit('task', pair)中的pair
				data.map(function(topicPair) {
					// 接下来都是 jquery 的用法了
					//console.log(topicPair[1]);
					var url = topicPair[0];
					var html = topicPair[1];
					var $ = cheerio.load(html);
					var con_right_arr_a = $('.muted-link');
					con_right_arr_a.each(function(index, el) {
						var link = http ? http + $(this).attr('href') : $(this).attr('href');
						if (index < 50) {
							var news_item = {
								//获取文章的标题
								title: $(this).text().trim(),

								//获取当前文章的url
								link: link

							};
							subArr.push(news_item);
						} else {
							return false
						}

					});
					var newArr = {
						subArr: subArr
					}
					resolve(newArr);
				});
			});
		});
	}

}