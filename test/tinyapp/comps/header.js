var C = require('../lib/wxpage').Component

module.exports = C('header', function (name) {
	return {
		name,
		data: {
			title: 'header~'
		},
		onLoad: function () {
			console.log('On header load')
		}
	}
})
