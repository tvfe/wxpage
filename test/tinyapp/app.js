require('./lib/wxpage').A({
	config: {
		home: 'index', // default index
		// routes: {
		// 	index: 'pages/index'
		// }
		routes: function (name) {
			return `pages/${name}`
		}
	},
	onLaunch: function() {
		console.log('APP is Running')
	}
})
