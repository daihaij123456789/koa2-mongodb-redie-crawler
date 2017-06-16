const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

var mongoose = require('./lib/config/mongoose.js');
var db = mongoose();
var config = require('./lib/config/config');
const index = require('./routes/index');
const users = require('./routes/users');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
	extension: 'jade'
}));

// logger
app.use(async(ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx) {
	console.log(err)
	logger.error('server error', err, ctx);
});

/*;
console.log()

console.log(data)*/
/*var Crawler = require('./lib/crawler/crawler')

var opts = {
	url: 'http://api.douban.com/v2/movie/subject/',
	encoding: null,
	mothod: 'GET'
}
var http = 'https://github.com';

request(opts).then(function(res) {
	var crawler = Crawler.CrawlerMore(http,'js',5);
	return crawler();
}).then(function(data) {
	console.log(data)
})*/

module.exports = app;