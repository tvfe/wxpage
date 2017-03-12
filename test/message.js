'use strict'

var assert = require('assert')
var message = require('../lib/message')
describe('# off()', function() {
	it('Remove by type and hander', function() {
		var once = 0
		var hander = function () {
			once ++
		}
		message.on('click', hander)
		message.emit('click')
		message.off('click', hander)
		message.emit('click')
		assert(once === 1)
	})
	it('Remove all hander of type', function() {
		var once = 0
		var hander = function () {
			once ++
		}
		message.on('click', hander)
		message.emit('click')
		message.off('click')
		message.emit('click')
		assert(once === 1)
	})
	it('Remove all', function() {
		var once = 0
		var hander = function () {
			once ++
		}
		message.on('click', hander)
		message.emit('click')
		message.off()
		message.emit('click')
		assert(once === 1)
	})
})

describe('# emit()', function() {
	it('Multiple data', function (done) {
		message.on('params', function (a,b,c) {
			assert.equal(a, 1)
			assert.equal(b, 2)
			assert.equal(c, 3)
			done()
		})
		message.emit('params', 1,2,3)
		message.off('params')
	})
})
