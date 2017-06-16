var router = require('koa-router')();
var newsbll = require('../lib/bll/newsbll');

var NewsController = require('../lib/controllers/NewsController.js');

router.get('/', function(ctx, next) {
	ctx.body = 'this a users response!';
});

//routes: 调用controller获取数据
//controller: 确保有数据返回(无数据就去执行爬虫) 主要是业务逻辑操作
//bll: 完全对数据库操作 返回Promise
//model: 数据库映射
router.get('/news', async function(ctx, next) {
	console.log('users/news');
	var newsController = new NewsController();
	var items = await newsController.findAllNews();
	ctx.body = items;
})

router.get('/newest', async function(ctx, next) {
	console.log('users/newest');
	var newsController = new NewsController();
	var items = await newsController.findAllNewest();
	ctx.body = items;
})

module.exports = router;