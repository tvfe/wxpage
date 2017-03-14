var P = require('../lib/wxpage')
var Header = require('../comps/header')
P('index', {
	comps: [
		Header('header1'),
		Header('header2')
	],
	data: {

	},
	onLoad: function() {

	}
})
