## WXPage
[WXPage](http://git.code.oa.com/vfe-components/wxpage) 是一个极其轻量的微信小程序开发框架，其中的API蕴含了“`极致页面打开速度`的思想”，出于维护与效率而设计的功能，框架来自“`腾讯视频`”小程序的项目沉淀。

## 目录

* [使用](#%E7%A8%8B%E5%BA%8F)
* [程序](#%E7%A8%8B%E5%BA%8F)
	- [定义](#a%E5%AE%9A%E4%B9%89)
	- [扩展的生命周期](#a%E6%89%A9%E5%B1%95%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
	- [扩展的配置](#a%E6%89%A9%E5%B1%95%E7%9A%84%E9%85%8D%E7%BD%AE-config)

* [组件](#%E7%BB%84%E4%BB%B6)
	- [定义](#c%E5%AE%9A%E4%B9%89)
	- [使用组件](#c%E4%BD%BF%E7%94%A8%E7%BB%84%E4%BB%B6)
	- [扩展的生命周期](#c%E6%89%A9%E5%B1%95%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
	- [VM实例方法](#cvm%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95)

* [页面](#%E9%A1%B5%E9%9D%A2)
	- [定义](#p%E5%AE%9A%E4%B9%89)
	- [扩展的生命周期](#p%E6%89%A9%E5%B1%95%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
	- [实例属性](#p%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)
	- [实例方法](#p%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95)

### 使用

将[dist/wxpage.js](http://git.code.oa.com/vfe-components/wxpage/blob/master/dist/wxpage.js) 放置到你的项目目录下，例如: "lib/wxpage.js"。使用[DEMO](http://git.code.oa.com/vfe-components/wxpage/tree/master/test/tinyapp)

```js
var P = require('./wxpage')
var A = require('./wxpage').A
var C = require('./wxpage').C
```

### 程序
#### ❖ A`/`定义

示例：
```js
var A = require('./wxpage').A
A({
	config: {
		route: '/pages/$page'   // $page 会被替换成页面名
	},
	onLaunch: function () {

	},
	onShow: function () {

	}
})
```

#### ❖ A`/`扩展的生命周期

- **onAwake(time`<Number>`)**

	小程序进入后台模式后再激活的时候触发。`time`是耗时。

#### ❖ A`/`扩展的配置(config)

- **route** `必需`

	页面目录的路由地址，`$page`会被替换为页面名

- **extendPageBefore(name, def, modules)** `可选`

	自定义扩展页面，在框架执行扩展之前。

- **extendPageAfter(name, def, modules)** `可选`

	自定义扩展页面，在框架执行扩展之后。

### 组件
#### ❖ C`/`定义

示例：
```html
<template name="comp">
	<button>It is component: {{name}}</button>
</template>
```

```js
var C = require('./wxpage').C
C('comp', function (vm) {
	return {
		data: {/*...*/},
		onLoad: function () {
			// do something
			vm.$set({
				name: 'comp'
			})
		}
	}
})
```

#### ❖ C`/`使用组件

模板:
```html
<import src="/path/to/comp.wxml"></import>

<template is="item" data="{{...comp}}"/>
```

Page:
```js
var P = require('./wxpage')
P({
	comps: [require('/path/to/comp')]
})
```

#### ❖ C`/`扩展的生命周期

同页面的生命周期

#### ❖ C`/`VM实例方法

- **$set({...})**

	同 **this.setData({...})**，但只对当前组件数据生效
	```js
	vm.$set({
		title: 'This is component'
	})
	```

- **$data()**

	获取当前组件的 `data` 对象

### 页面
#### ❖ P`/`定义

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


#### ❖ P`/`扩展的生命周期

- **onLaunch()**

	小程序第一次运行的时候调用，此时对应的页面并未被加载。

- **onAwake(time`<Number>`)**

	小程序进入后台模式后再激活的时候触发。`time`是耗时。

- **onPreload(res)**

	调用 this.**$preload**(url) 的时候触发，此时对应的页面并未被加载，`res`:
	```
	{
		url: '', //完整的来源url
		query: {} //url上解析出来的查询参数
	}
	```

- **onNavigate(res)**

	页面间跳转开始时调用，此时对应的页面并未被加载，`res`:
	```
	{
		url: '', //完整的来源url
		query: {} //url上解析出来的查询参数
	}
	```


#### ❖ P`/`实例属性

- **$name**

	当前页面名称

- **$state**

	页面的一些状态集合，有以下字段：

	- firstOpen <`Boolean`> 是否首个被小程序启动的页面

- **$cache**

	本地缓存的封装, 方法如下：

	- `set(key, value[, expire][, cb])` 如果传 `cb` 参数，会使用异步模式并回调
	- `get(key[, cb])` 如果传 `cb` 参数，会使用异步模式并回调

- **$session**

	使用本地缓存实现的session, 小程序退出后session会消息，`适用于大数据对象的临时存储` 方法如下：

	- `set(key, value[, cb])` 如果传 `cb` 参数，会使用异步模式并回调
	- `get(key[, cb])` 如果传 `cb` 参数，会使用异步模式并回调

- **$emitter**

	页面内的消息模块，作用于页面实例与及引用的组件实例，方法：

	 - `on`   监听
	 - `emit` 派发
	 - `off`  取消监听


#### ❖ P`/`实例方法

- **$route**(pagename[, config]) => 别名 **$navigate**

	wx.`navigateTo`的封装。跳转到指定页面，pagename 可以带上 `queryString`, 例如

	```js
	this.$route('play?vid=xxx&cid=xxx')
	```

- **$redirect**(pagename[, config])

	wx.`redirectTo`的封装。跳转到指定页面, **替换页面，不产生历史**，pagename 可以带上 `queryString`, 例如

	```js
	this.$redirect('play?vid=xxx&cid=xxx')
	```

- **$switch**(pagename[, config])

	wx.`switchTab`的封装。

- **$back**([delta])

	wx.`navigateBack`的封装。
	```js
	this.$back()
	```

- **$preload**(pagename)

	提前预加载指定页面（会触发对应页面的`onPreload`声明周期）
	```js
	this.$preload('play?vid=xxx&cid=xxx')
	```

- **$bindRoute**()

	点击代理方法，绑定 `$onRoute` 逻辑，在元素上声明 `data-url` 作为跳转地址，支持切面方法：
	+ `data-before` 跳转前执行
	+ `data-after` 	跳转后执行

	示例：
	```html
	<button
		bindtap="$bindRoute"
		data-url="/pages/play"
		data-before="onClickBefore"
	>click redirect</button>
	```

- **$bindRedirect**()

	同 **$bindRoute**, 绑定 `$onRedirect`

- **$bindSwitch**()

	同 **$bindRoute**, 绑定 `$onSwitch`

- **$on**(key, handler)

	监听跨页面间的消息

- **$emit**(key, data)

	派发页面间的消息

- **$off**(key, handler)

	取消监听消息

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
