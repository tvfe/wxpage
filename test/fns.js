'use strict'

var fns = require('../lib/fns')
var assert = require('assert')
describe('type', function () {
	it('function', function () {
		assert(fns.type(function () {}), 'function')
	})
	it('object', function () {
		assert(fns.type({}), 'function')
	})
	it('null', function () {
		assert(fns.type(null), 'function')
	})
	it('number', function () {
		assert(fns.type(0.23), 'function')
	})
	it('undefined', function () {
		assert(fns.type(void(0)), 'function')
	})
})
describe('lock', function () {
	it('run once', function (done) {
		var count = 0
		var fn = fns.lock(function (release) {
			count ++
			setTimeout(function () {
				assert.equal(count, 1)
				release()
				done()
			})
		})
		fn()
		fn()
	})
	it('reuse', function (done) {
		var fn = fns.lock(function (release, cb) {
			setTimeout(function () {
				release()
				cb && cb()
			})
		})
		fn()
		fn(function () {
			assert(false, 'The function should be locked')
		})
		setTimeout(function () {
			fn(function () {
				done()
			})
		}, 10)
	})
})

describe('queue', function () {
	it('Run by sequence', function (done) {
		var index = 0
		var results = [1, 2, 3]
		var timers = [50, 20, 10]
		var fn = fns.queue(function (next, num) {
			var pointer = index++
			setTimeout(function () {
				next()
				assert.equal(num, results.shift())
				if (index >= 3) {
					done()
				}
			}, timers[pointer])
		})
		fn(1)
		fn(2)
		fn(3)
	})
	it('Run 1 task at once', function (done) {
		var count = 0
		var fn = fns.queue(function (next, timer) {
			setTimeout(function () {
				count ++
				next()
			}, timer)
		})
		fn(50)
		fn(50)
		fn(50)
		setTimeout(function () {
			assert.equal(count, 1)
		}, 60)
		setTimeout(function () {
			assert.equal(count, 2)
		}, 120)
		setTimeout(function () {
			assert.equal(count, 3)
			done()
		}, 180)

	})
	it('Parall 3 task', function (done) {
		var count = 0
		var fn = fns.queue(function (next, timer) {
			setTimeout(function () {
				count ++
				next()
			}, timer)
		}, 3)
		fn(50)
		fn(50)
		fn(50)
		fn(50)
		fn(100)
		setTimeout(function () {
			assert.equal(count, 3)
		}, 60)
		setTimeout(function () {
			assert.equal(count, 4)
		}, 120)
		setTimeout(function () {
			assert.equal(count, 5)
			done()
		}, 170)
	})
})

describe('delegator', function () {
	it('Delegator run only once', function (done) {
		var times = 0
		var fn = fns.delegator(function (end) {
			times ++
			setTimeout(function () {
				end('a', 'b')
			}, 80)
		})
		fn(function (r1, r2) {
			assert.equal(r1, 'a')
			assert.equal(r2, 'b')
		})
		fn(function (r1, r2) {
			assert.equal(r1, 'a')
			assert.equal(r2, 'b')
		})
		setTimeout(function () {
			fn(function (r1, r2) {
				assert.equal(r1, 'a')
				assert.equal(r2, 'b')
			})
		}, 50)
		setTimeout(function () {
			assert.equal(times, 1, 'delegator should run only one times')
			fn(function (r1, r2) {
				assert.equal(r1, 'a')
				assert.equal(r2, 'b')
			})
			setTimeout(function () {
				assert.equal(times, 2, 'delegator should run twice times')
				done()
			}, 100)
		}, 100)
	})
})

describe('once', function () {
	it('run once', function (done) {
		var count = 0
		var fn = fns.once(function (num) {
			count ++
			setTimeout(function () {
				assert(num, 1)
				assert.equal(count, 1)
				done()
			})
		})
		fn(1)
		fn(2)
		fn(3)
	})
})
