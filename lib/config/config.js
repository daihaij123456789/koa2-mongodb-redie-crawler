module.exports = {
	serverConfig: {
		port: '3000',
		smtps: [{ //邮件配置
			host: '',
			port: 0,
			secure: false,
			auth: {
				user: '',
				pass: '',
				title: ''
			}
		}]
	},
	mongodbConfig: {
		host: 'localhost',
		port: 27017,
		username: '',
		password: '',
		database: 'crawler'
	},

	redisConfig: {
		host: 'localhost',
		port: 6379,
		username: '',
		password: ''
	},

	crawlerUrlConfig: {
		newsRootUrl: 'https://segmentfault.com/news', //热门的
		newestRootUrl: 'https://segmentfault.com/news/newest' //最新的
	}
}