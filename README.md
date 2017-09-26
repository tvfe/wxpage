## WXPage
[![npm version](https://badge.fury.io/js/wxpage.svg)](https://www.npmjs.com/package/wxpage)

<img align="center" src="https://user-images.githubusercontent.com/1167668/30198520-bac11c08-94a0-11e7-8566-c9ee49edce74.png"/>

[WXPage](https://github.com/tvfe/wxpage#wxpage) 是一个极其轻量的微信小程序开发框架，其中的API蕴含了“极致页面打开速度的思想”，为可维护性与开发效率而设计的功能，框架来自“腾讯视频”小程序的项目沉淀。

## 目录

* [使用](#使用)
* [程序](#程序)
  - [定义](#-a定义)
  - [扩展的生命周期](#-a扩展的生命周期)
  - [扩展的配置](#-a扩展的配置)

* [组件](#组件)
  - [定义](#-c定义)
  - [使用组件](#-c使用组件)
  - [扩展的生命周期](#-c扩展的生命周期)
  - [VM实例方法](#-cVM实例方法)

* [页面](#页面)
  - [定义](#-p定义)
  - [扩展的生命周期](#-p扩展的生命周期)
  - [实例属性](#-p实例属性)
  - [实例方法](#-p实例方法)
* [案例](#谁在用)

### 使用

将[dist/wxpage.js](https://github.com/tvfe/wxpage/blob/github/dist/wxpage.js) 放置到你的项目目录下，例如: "lib/wxpage.js"。使用[DEMO](https://github.com/tvfe/wxpage-app)

```js
var P = require('./wxpage')
var A = require('./wxpage').A
var C = require('./wxpage').C
```

使用 [`CLI`](https://github.com/tvfe/wxpage-cli) 初始化项目：

```bash
npm install wxpage-cli -g

wxpage init
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

- **onPageLaunch()**

  小程序第一次运行的时候调用，此时对应的页面并未被加载。

- **onAppLaunch(opts)**

  App.onLaunch 触发时调用。
  opts:
  - `path`  String  打开小程序的路径
  - `query` Object  打开小程序的query
  - `scene` Number  打开小程序的场景值


- **onShow(opts)**

  App.onShow 触发时调用。
  opts:
  - `path`  String  打开小程序的路径
  - `query` Object  打开小程序的query
  - `scene` Number  打开小程序的场景值

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

  - `set(key, value[, expire][, cb])` 如果传 `cb` 参数，会使用异步模式并回调，否则直接同步返回结果。
    * `value`   缓存数据，可以为对象
    * `expire`  缓存过期时间，单位为毫秒。如果为 `true` ，那么保持已存在的缓存时间，如果没有缓存，那么认为过期，不保存。
    * `cb`      可选，异步写的时候回调，接收参数：cb(err), err不为空代表失败。
  - `get(key[, cb])` 如果传 `cb` 参数，会使用异步模式并回调
    * `cb`      可选，异步读的时候回调，接收参数：cb(err, data), err不为空代表失败。

  ```js
  Page({
    onLoad: function () {
      // 同步写
      this.$cache.set('page_data', {
          name: '首页'
      })
      // 异步写
      this.$cache.set('page_data_another', {
          name: '首页'
      }, function (err) {
        // success or fail
      })
      var data = this.$cache.set('page_data') // {name : '首页'}
      // 异步读
      this.$cache.get('page_data', function (err, data) {
        // success or fail
        if (err) {
          console.log('Get data error', err)
        } else {
          console.log('Get data success', data)
        }
      })
      // 设定缓存时间，例如：1000 毫秒
      this.$cache.set('page_data', {
          name: '首页'
      }, 1000)
      setTimeout(()=> {
        // 保持上次缓存时间: 1000-200毫秒
        this.$cache.set('page_data', {
            name: '首页'
        }, true)
      }, 200)
    }
  })
  ```


- **$session**

  使用本地缓存实现的session, 小程序退出后session会消失，`适用于大数据对象的临时存储` 方法如下：

  - `set(key, value[, cb])` 如果传 `cb` 参数，会使用异步模式并回调
  - `get(key[, cb])` 如果传 `cb` 参数，会使用异步模式并回调
  ```js
  Page({
    onLoad: function () {
      this.$session.set('page_session_data', {
          name: '首页'
      })
    }
  })
  ```

- **$emitter**

  页面内的消息模块，作用于当前页面实例与及引用的子组件实例，方法：

   - `on`   监听
   - `emit` 派发
   - `off`  取消监听


#### ❖ P`/`实例方法

- **$setData**([prefix<`String`>, ]obj)

  指定 `prefix` 的时候可以为data的每一个项添加访问路径前缀。不传相当于 **setData(obj)**

- **$curPage**()

  获取当前页面实例。取 **getCurrentPages** 的最后一个项。

- **$curPageName**()

  获取当前页面实例对应的页面名。根据[A.config.route](#-a扩展的配置config) 的配置解析当前页面实例的route。
  > Notice: 由于基础库1.2.0以下不支持 Page.prototype.route，故不兼容场景只能取到空字符串

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

- **$launch**(pagename[, config])

  wx.`reLaunch`的封装。

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
  + `data-after`  跳转后执行

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

  派发页面间的消息。

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

## 谁在用

腾讯视频 | 王者荣耀攻略宝典 | 何润锋工作室 | 腾讯大家
------------ | ------------- | ------------- | -------------
<img src="https://i.gtimg.cn/qqlive/images/20170301/wxapp.png" width="120"/> | <img src="https://i.gtimg.cn/qqlive/images/tinyapp_pvp_qrcode/tinyapp_pvp.jpg" width="120"/> | <img src="https://i.gtimg.cn/qqlive/images/tinyapp_qrcodes/qqnews_hrf.jpg" width="120"/> | <img src="https://user-images.githubusercontent.com/1167668/30263018-ed389e92-9705-11e7-9e10-be56d8b874da.jpg" width="120"/>
