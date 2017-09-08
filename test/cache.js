'use strict'

var cache = require('../lib/cache')
var assert = require('assert')
var storage = {}
/**
 * Mock
 */
var wx = global.wx = {
	setStorage: function (opts) {
		setTimeout(function () {
			storage[opts.key] = opts.data
			opts.success && opts.success()
		})
	},
	setStorageSync: function (key, value) {
			storage[key] = value
	},
	getStorage: function (opts) {
		setTimeout(function () {
			opts.success && opts.success(storage.hasOwnProperty(opts.key) ? storage[opts.key] : null)
		})
	},
	getStorageSync: function (key, value) {
		return storage.hasOwnProperty(key) ? storage[key] : null
	},
	removeStorage: function (opts) {
		setTimeout(function () {
			delete storage[opts.key]
			opts.success && opts.success()
		})
	},
	removeStorageSync: function (key) {
		delete storage[key]
		return true
	}
}
describe('set', function () {
	it('set sync', function () {
		cache.set('data-sync', {
			title: 123
		})
		assert.equal(123, cache.get('data-sync').title)
	})
	it('set async', function (done) {
		cache.set('data-async', {
			title: 123
		}, function () {
			assert.equal(123, cache.get('data-async').title)
			done()
		})
	})
	it('set expire', function (done) {
		cache.set('data-expire', {
			title: 123
		}, 50, function () {
			setTimeout(function () {
				assert.equal(null, cache.get('data-expire'))
				done()
			}, 80)
		})
	})
	it('set expire x2', function (done) {
		cache.set('data-expire-x2', {
			title: 123
		}, 50, function () {
			cache.set('data-expire-x2', {
				title: 456
			}, 100)
			setTimeout(function () {
				assert.equal(456, cache.get('data-expire-x2').title)
				done()
			}, 80)
		})
	})
	it('set expire then update value', function (done) {
		cache.set('data-expire-update', {
			title: 123
		}, 50, function () {
			cache.set('data-expire-update', {
				title: 456
			}, true)
			setTimeout(function () {
				assert.equal(null, cache.get('data-expire-update'))
				done()
			}, 80)
		})
	})
	it('set session sync', function () {
		cache.session.set('ss-sync', {
			title: 123
		})
		assert.equal(123, cache.session.get('ss-sync').title)
	})
	it('set session async', function (done) {
		cache.session.set('ss-async', {
			title: 123
		}, function () {
			assert.equal(123, cache.session.get('ss-async').title)
			done()
		})
	})
})
