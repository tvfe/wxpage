## WXPage

### 页面
* **定义**

	页面请放在 `/pages/$page` 下，以 `index.js` 为页面逻辑层入口：

	声明页面，需要引入 **basepage** 声明方法：

	```js
	var P = require("../../module/basepage");
	// P(pagename, options)
	```

	示例：
	```js
	P('index', {
		data: {/*...*/*},
		onLoad: function () {
			// do something
		}
	})
	```
* **扩展的生命周期**

	- **onNavigate(res)**

		页面间跳转开始时调用，此时对应的页面并未被加载
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
		- firstShareOpen <`Boolean`> 是否由分享打开的首个启动页面

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

	- **$back**()

		页面后退，如果退无可退，返回首页

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
