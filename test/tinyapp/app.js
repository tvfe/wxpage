
var d = new Date()
require('./lib/wxpage').A({
	config: {
		route: '/pages/$page'
	},
	onLaunch: function() {
		console.log('## APP Launch', new Date() - d, getCurrentPages(), this)
		console.log('APP is Running')
	},
	onShow: function () {
	}
})
