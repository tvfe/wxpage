var P = require('../lib/wxpage')

P('channel', {
	data: {},
	onLoad: function(res) {
		console.log('## On chennel page load, with query:', res)
	}
})
