require('./lib/wxpage').A({
	config: {
		home: 'index', // default index
		route: 'pages/$page'
	},
	onLaunch: function() {
		console.log('APP is Running')
	}
})
