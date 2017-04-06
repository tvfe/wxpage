
var d = new Date()
console.time('Run')
require('./lib/wxpage').A({
	config: {
		route: '/pages/$page'
	},
	onLaunch: function(opts) {
		console.timeEnd('Run')
		console.time('Run2')
		console.log('## Page Launch', new Date() - d, getCurrentPages())
		console.log('APP is Running', opts)
	},
	onShow: function () {
	}
})
