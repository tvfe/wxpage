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
		console.log('## On index page load')
		this.$preload('play?cid=456')
	},
	onPlay: function () {
		this.$route('play?cid=123')
	}
})
