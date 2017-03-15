var C = require('../../weima').Component
var id = 1
module.exports = C('header', function () {
	return {
		data: {
			title: 'Weima share demo'
		},
		onLoad: function () {
			console.log('## On header load')
		}
	}
})
