var C = require('../lib/wxpage').C
var id = 1
module.exports = C('header', function (vm) {
	return {
		data: {
			title: 'header~'
		},
		onLoad: function () {
			console.log('On header load~', this.data)
			vm.$set({'title': 'header'+id++})
		},
		onTap: function (e) {
			console.log(e)
		}
	}
})
