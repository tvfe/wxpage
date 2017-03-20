var P = require('../lib/wxpage')
var Header = require('../comps/header')
var d = new Date()

P('index', {
	comps: [
		Header,
	],
	data: {
	},
	onLaunch: function () {
		console.log('## On index page launch', new Date() - d, 'ms')
	},
	onLoad: function() {
		console.log('## On index page load')
		this.$preload('play?cid=456')
	},
	onPlay: function () {
		console.time('onNavigate')
		this.$route('play?cid=123')
	},
	onShow: function () {
		console.log('## On index page show')
	},
	onAwake: function (t) {
		console.log('## On index page awake', t)
	}
})
