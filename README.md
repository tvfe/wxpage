## WXPage
为优化而生的的极简微信小程序开发框架。

### 程序
* **定义**

	示例：
	```js
	var A = require('./wxpage').A
	A({
		config: {
			route: '/pages/$page' 	// $page 会被替换成页面名
		},
		onLaunch: function () {

		},
		onShow: function () {

		}
	})
	```


### 页面
* **定义**

	示例：
	```js
	var P = require('./wxpage')
	P('index', {
		data: {/*...*/},
		onLaunch: function () {

		},
		onLoad: function () {
			// do something
		}
	})
	```


### 组件
* **定义**

	示例：
	```js
	var C = require('./wxpage').C
	C('index', {
		data: {/*...*/},
		onLoad: function () {
			// do something
		}
	})
	```

* **扩展的生命周期**

	- **onLaunch()**

		小程序第一次运行的时候调用，此时对应的页面并未被加载。

	- **onPreload(res)**

		调用 page.$preload(url) 的时候触发，此时对应的页面并未被加载。
		```
		res:
			url 完整的来源url
			query url上解析出来的查询参数
		```

	- **onNavigate(res)**

		页面间跳转开始时调用，此时对应的页面并未被加载。
		```
		res:
			url 完整的来源url
			query url上解析出来的查询参数
		```


* **实例属性**

	- **$name**

		当前页面名称

	- **$state**

		页面的一些状态集合，有以下字段：

		- firstOpen <`Boolean`> 是否小程序被打开首个启动页面

* **实例方法**

	- **$route**(pagename[, config])

		跳转到指定页面，pagename 可以带上 `queryString`, 例如

		```js
		this.$route('play?vid=xxx&cid=xxx')
		```

	- **$redirect**(pagename[, config])

		跳转到指定页面, **替换页面，不产生历史**，pagename 可以带上 `queryString`, 例如

		```js
		this.$redirect('play?vid=xxx&cid=xxx')
		```

	- **$switch**(pagename[, config])

		switchTab的封装方法。

	- **$back**()

		页面后退，如果退无可退，返回首页

	- **$home**()

		返回首页，框架取第一个构造的页面模块作为首页

	- **$put**(id, value)

		指定 `id` 存在一份数据，可以为任何类型，以供其它逻辑获取使用

	- **$take**(id)

		根据 `id` 获取数据，数据只能被存在一次，获取一次。如果只存放一次，第二次获取
		会得到 null 。

		示例：
		```js
		this.$put('play:prefetch', new Promise(function (resolve, reject) {
			wx.request(url, function (err, data) {
				resolve(data)
			})
		}))

		this.$take('play:prefetch').then(function (data) {
			// get data
		})

		this.$take('play:prefetch') // => null
		```
