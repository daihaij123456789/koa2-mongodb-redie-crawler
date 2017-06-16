var router = require('koa-router')();
var GithubLinkController = require('../lib/controllers/GithubLinkController.js');
router.get('/', async function(ctx, next) {
	ctx.state = {
		title: 'koa2 title'
	};

	await ctx.render('index', {});
})


router.get('/githubLink', async function(ctx, next) {
	console.log('users/githubLink');
	var GithubLinkController = new GithubLinkController();
	var items = await GithubLinkController.findAllGithubLink();
	ctx.body = items;
})
module.exports = router;