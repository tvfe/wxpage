var C = require('../lib/wxpage').C
module.exports = C('header', function (vm) {
	return {
		data: {
			title: 'header~'
		},
		onAppLaunch: function () {
			vm.$set({
				title: 'Launch...'
			})
		},
		onLoad: function () {
			console.log('On header load', this.data)
			setTimeout(function () {
				vm.$set({'title': '√ Done'})
			}, 1000)
			setTimeout(function () {
				C.emit('some_message', 'I am component/header!')
			}, 100)
		},
		onTap: function (e) {
			console.log(e)
		}
	}
})
