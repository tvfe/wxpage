
var d = new Date()
require('./lib/wxpage').A({
	config: {
		home: 'index', // default index
		route: '/pages/$page'
	},
	onLaunch: function() {
		console.log('## APP Launch', new Date() - d, getCurrentPages(), this)
		console.log('APP is Running')
	},
	onShow: function () {
		console.log('## APP Launch', new Date() - d, getCurrentPages())
	}
})
