var P = require('../../weima')
var Header = require('../../comps/header/index')
P('index', {
	comps: [
		Header(),
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
