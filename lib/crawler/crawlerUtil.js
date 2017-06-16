var util = require('../utils/util');
var config = require('../config/config');
var moment = require('moment');
var S = require('string');

function CrawlerUtil() {
	var self = this;
	self.realTime = function(time) { // xx分钟   //xx小时  //xx天  //xx-xx-xx
		var current = moment();
		var num = S(time).toInt();
		var key;
		if (time.indexOf('秒') > 0) {
			key = 'seconds';
		} else if (time.indexOf('分钟') > 0) {
			key = 'minutes';
		} else if (time.indexOf('小时') > 0) {
			key = 'hours';
		} else if (time.indexOf('天') > 0) {
			key = 'days';
		}
		if (key) return current.subtract(num, key).format('YYYY-MM-DD HH:mm:ss');
		return time;
	}
	self.classifyTrans = function(classify) {
		var url;
		switch (classify) {
			case '前端':
				url = 'frontend';
				break;
			case '后端':
				url = 'backend';
				break;
			case 'iOS':
				url = 'ios';
				break;
			case 'Android':
				url = 'android';
				break;
			case '安全':
				url = 'netsec';
				break;
			case '工具':
				url = 'tools';
				break;
			case '程序员':
				url = 'programmer';
				break;
			case '行业':
				url = 'industry';
				break;
			default:

		}
		return {
			name: classify,
			url: url
		};
	}

	self.getType = function(url) {
		if (S(url).contains('newest')) {
			return 'newest';
		}
		return 'news';
	}
}

var crawlerUtil = new CrawlerUtil();
module.exports = crawlerUtil;