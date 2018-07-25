## WXPage
[![npm version](https://badge.fury.io/js/wxpage.svg)](https://www.npmjs.com/package/wxpage)

<img align="center" src="https://user-images.githubusercontent.com/1167668/30198520-bac11c08-94a0-11e7-8566-c9ee49edce74.png"/>

[WXPage](https://github.com/tvfe/wxpage#wxpage) 是一个极其轻量的微信小程序开发框架，其中的API蕴含了“极致页面打开速度的思想”，为可维护性与开发效率而设计的功能，框架来自“腾讯视频”小程序的项目沉淀。

## 目录

* [使用](#使用)
* [类方法](#类方法)
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
var wxpage = require('./wxpage')
```

使用 [`CLI`](https://github.com/tvfe/wxpage-cli) 初始化项目：

```bash
npm install wxpage-cli -g

wxpage init
```


### 类方法

```js
const wxpage = require('/path/to/wxpage.js');
```


- wxpage.**A**(def<`Object`>)
  程序定义方法，快捷方法：
  ```js
  App.A({

  });
  ```

- **wxpage**(def<`Object`>)
  页面定义方法，快捷方法：
  ```js
  Page.P({

  });
  ```

- wxpage.**C**(def<`Object`>)
  组件定义方法
  ```js
  const { A } = require('/path/to/wxpage.js')
  A({

  });
  ```

- wxpage.**on**(key<`String`>, handler<`Function`>)
  监听APP与页面间的消息

- wxpage.**emit**(key<`String`>, message<`任意`>)
  监听APP与页面间的消息

- wxpage.**off**(key<`String`>, handler<`Function`>)
  取消监听APP与页面间的消息


### 程序
在小程序的入口文件 `app.js` 里定义

#### 程序-定义

示例：
```js
const { A } = require('./wxpage')
A({
  config: {
    route: '/pages/$page'   // $page 会被替换成页面名
  },
  onLaunch: function () {

  },
  onShow: function () {

  }
});
```

#### 程序-生命周期

- **onAwake**(time`<Number>`)

  小程序进入后台模式后再激活的时候触发。`time`是耗时。

#### 程序-配置

`wxpage`所扩展的配置
```js
A({
  config: {
    /*所有微信wxpage所需的配置*/
  }
});
```

- **route** `必需`

  页面目录的路由地址，`$page`会被替换为页面名。

> route 支持数组，为多项路由的时候，必须搭配 `resolvePath` 使用，否则默认采用第一项作为路径还原。


- **resolvePath(name`<String>`)** `可选`

  ```js
  A({

    config: {
      route: ['/page/$page', '/pages/$page'],
      resolvePath: function (name) {
        return `/page/${name}`
      }
    }
  });
  ```

- **extendPageBefore(name, def, modules)** `可选`

  自定义扩展页面，在框架执行扩展之前。

- **extendPageAfter(name, def, modules)** `可选`

  自定义扩展页面，在框架执行扩展之后。

- **extendComponentBefore(def)** `可选`

  自定义扩展组件，在框架执行扩展之前。例如为每个组件挂在一个实例方法：
  ```js
  A({
    config: {
      extendComponentBefore: function (def, { fns }) {
        fns.wrapFun(def.created, function () {
          this.request = function () {
            // ...
          }
        })
      }
    }
  });
  ```


### 组件
基于小程序原生组件方案的扩展，提供了父-子组件间的关系引用，一些实用的实例方法等

#### 组件-定义

- 构造方法、配置声明

{COMPONENT}.js
```js
Component.C({
  data: {},
  attached: function () {
    /**
     * this.$root
     * this.$parent
     */
  }
});
```

{COMPONENT}.json
```json
{
  "component": true
}
```


- 使用

{PAGE}.json
```json
{
  "usingComponents": {
    "{COMPONENT}": "/comps/{COMPONENT}/{COMPONENT}"
  }
}
```

{PAGE}.wxml
```html
<custom-component binding="$" />
```

#### 组件-实例方法

- **$set**({...})
  同 **this.setData({...})**

- **$data**()
  获取当前组件的 `data` 对象，同 `this.data`


- **$curPage**()

  获取当前页面实例。取 **getCurrentPages** 的最后一个项。

- **$curPageName**()

  获取当前页面实例对应的页面名。根据[A.config.route](#-a扩展的配置config) 的配置解析当前页面实例的route。
  > Notice: 由于基础库1.2.0以下不支持 Page.prototype.route，故不兼容场景只能取到空字符串

- **$on**(key, handler)

  监听跨页面间的消息

- **$emit**(key, data)

  派发页面间的消息

- **$off**(key, handler)

  取消监听消息

- **$set**(data)

  等同于 `this.setData(data)`

- **$data**()

  等同于 `this.data`

- **$call**(method, arg1, arg2[, ...])

  通过消息的方式调用父组件方法，方法不存在也不会报错

- **$route**(pagename[, config]) => 别名 **$navigate**

  wx.`navigateTo`的封装。跳转到指定页面，pagename 可以带上 `queryString`, 例如

  ```js
  this.$route('play?vid=xxx&cid=xxx');
  ```

- **$redirect**(pagename[, config])

  wx.`redirectTo`的封装。跳转到指定页面, **替换页面，不产生历史**，pagename 可以带上 `queryString`, 例如

  ```js
  this.$redirect('play?vid=xxx&cid=xxx');
  ```

- **$switch**(pagename[, config])

  wx.`switchTab`的封装。

- **$launch**(pagename[, config])

  wx.`reLaunch`的封装。

- **$back**([delta])

  wx.`navigateBack`的封装。
  ```js
  this.$back();
  ```

- **$preload**(pagename)

  提前预加载指定页面（会触发对应页面的`onPreload`声明周期）
  ```js
  this.$preload('play?vid=xxx&cid=xxx');
  ```

- **$bindRoute**()

> 同页面


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

> 同页面

- **$take**(id)

> 同页面

#### 组件-实例属性

- **$root**
当前组件所属的页面组件实例
只在 `attached`, `ready`生命周期后生效

- **$parent**

在组件内获取父组件实例引用

```js
Component.C({
  attached: function () {
    this.$parent.data // 父组件
    this.$root.data   // 根组件，可能是父组件
  }
});
```

- **$refs**
  指定了 `ref` 的子组件实例Map，在父组件获取子组件引用：

```html
<custom-component binding="$" ref="customComp"/>
```

```js
Page.P({
  onLoad: function () {
    this.$refs.customComp // 根据ref属性获取子组件的实例引用
  }
});
```

- **$cache**

> 同页面缓存模块

- **$session**

> 同页面缓存模块


### 页面
`wxpage` 为页面组件扩展了一些利于优化需求使用的声明周期方法与及实例方法

#### 页面-定义

```js
Page.P('{PNAME}', {
  data: {
    message: 'Hello MINA!'
  },
  onNavigate: function () {
    this.$preload('detail?id=xxx')
  },
  onLoad: function () {
  }
})
```


#### 页面-生命周期

- **onPageLaunch()**

  小程序第一次运行的时候调用，此时对应的页面并未被加载。

- **onAppLaunch(opts)**

  App.onLaunch 触发时调用。
  opts:
  - `path`  String  打开小程序的路径
  - `query` Object  打开小程序的query
  - `scene` Number  打开小程序的场景值


- **onAppShow(opts)**

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


#### 页面-实例属性

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
  Page.P({
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
  });
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
  });
  ```

- **$emitter**

  页面内的消息模块，作用于当前页面实例与及引用的子组件实例，方法：

   - `on`   监听
   - `emit` 派发
   - `off`  取消监听

- **$refs**

  指定了 `ref` 的子组件实例Map




#### 页面-实例方法

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
  this.$route('play?vid=xxx&cid=xxx');
  ```

- **$redirect**(pagename[, config])

  wx.`redirectTo`的封装。跳转到指定页面, **替换页面，不产生历史**，pagename 可以带上 `queryString`, 例如

  ```js
  this.$redirect('play?vid=xxx&cid=xxx');
  ```

- **$switch**(pagename[, config])

  wx.`switchTab`的封装。

- **$launch**(pagename[, config])

  wx.`reLaunch`的封装。

- **$back**([delta])

  wx.`navigateBack`的封装。
  ```js
  this.$back();
  ```

- **$preload**(pagename)

  提前预加载指定页面（会触发对应页面的`onPreload`声明周期）
  ```js
  this.$preload('play?vid=xxx&cid=xxx');
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
  }));
  this.$take('play:prefetch').then(function (data) {
    // get data
  });
  this.$take('play:prefetch'); // => null
  ```


## 谁在用

腾讯视频 | 王者荣耀攻略宝典 | 何润锋工作室 | 腾讯大家 | 腾讯谷雨
------------ | ------------- | ------------- | ------------- | -------------
<img src="https://i.gtimg.cn/qqlive/images/20170301/wxapp.png" width="100"/> | <img src="https://i.gtimg.cn/qqlive/images/tinyapp_pvp_qrcode/tinyapp_pvp.jpg" width="100"/> | <img src="https://i.gtimg.cn/qqlive/images/tinyapp_qrcodes/qqnews_hrf.jpg" width="100"/> | <img src="https://user-images.githubusercontent.com/1167668/30263018-ed389e92-9705-11e7-9e10-be56d8b874da.jpg" width="100"/> | <img src="https://puui.qpic.cn/vupload/0/20180718_1531903979790.jpeg/0" width="100"/>
