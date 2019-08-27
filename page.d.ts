/*
 * @Author: Mr.Hope
 * @Date: 2019-08-14 22:13:31
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-08-28 00:37:28
 * @Description: WXPage声明文件
 */

/// <reference path="./node_modules/miniprogram-api-typings/index.d.ts" />

declare namespace WXPage {
  /** 页面跳转参数 */
  interface PageLifeTimeOptions {
    /** 页面跳转地址 */
    url?: string;
    /** 跳转参数 */
    query: Record<string, string>;
  }

  /** 事件监听器 */
  interface Emitter {
    /**
     * 开始监听一个事件
     *
     * @param eventName 开始监听的事件名称
     * @param callback 当监听事件被触发时执行的回调
     */
    on(event: string, callback: (...args: any[]) => void): void;
    /**
     * 触发一个事件
     *
     * @param eventName 触发的事件名称
     * @param args 传递的参数
     */
    emit(event: string, ...args: any[]): void;
    /** 结束一个事件监听 */
    off(event: string, callback: (...args: any[]) => void): void;
  }

  /** 信息监听器 */
  interface Message {
    /**
     * 开始监听一个事件
     *
     * @param eventName 开始监听的事件名称
     * @param callback 当监听事件被触发时执行的回调
     */
    $on(event: string, callback: (...args: any[]) => void): void;

    /**
     * 触发一个事件
     *
     * @param eventName 触发的事件名称
     * @param args 传递的参数
     */
    $emit(event: string, ...args: any[]): void;

    /** 结束一个事件监听 */
    $off(event: string, callback: (...args: any[]) => void): void;

    /**
     * 存放的数据，该数据只能取一次
     *
     * @param key 存储时的键值
     * @param data 存储时的数据
     * 
     * 案例：
     * 
     * ```js
     * this.$put('play:prefetch', new Promise(function (resolve, reject) {
     *   wx.request(url, function (err, data) {
     *     resolve(data)
     *   })
     * }));
     * this.$take('play:prefetch').then(function (data) {
     *   // get data
     * });
     * this.$take('play:prefetch'); // => null
     * ```
     */
    $put(key: string, data: any): void;

    /**
     * 取出存放的数据
     *
     * @param key 要取得数据的键值
     * 
     * 案例：
     *
     * ```js
     * this.$put('play:prefetch', new Promise(function (resolve, reject) {
     *   wx.request(url, function (err, data) {
     *     resolve(data)
     *   })
     * }));
     * this.$take('play:prefetch').then(function (data) {
     *   // get data
     * });
     * this.$take('play:prefetch'); // => null
     * ```
     */
    $take(key: string): any;
  }

  /** 页面跳转API */
  interface Redirector {

    /**
     * 导航到指定页面
     * 
     * 本函数是`wx.navigateTo`的封装。跳转到指定页面，`pagename`可以带上`queryString`
     *
     * @param pagename 页面名称或页面的路径
     * @param config 传递给`wx.navigateTo`Api的参数(url会自动由`pagename`解析的结果填充)
     * 
     * 示例：
     * 
     * ```js
     * this.$route('play?vid=xxx&cid=xxx');
     * this.$route('calulator?result=98',{
     *  success: () => {
     *    // do something
     *  }
     * });
     * ```
     */
    $route(pagename: string, config?: WechatMiniprogram.NavigateToOption): void;

    /**
     * 导航到指定页面,`$route`方法的别名
     *
     * 本函数是`wx.navigateTo`的封装。跳转到指定页面，`pagename`可以带上`queryString`
     *
     * @param pagename 页面名称或页面的路径
     * @param config 传递给 `wx.navigateTo` api的参数(url会自动由`pagename`解析的结果填充)
     *
     * 示例：
     *
     * ```js
     * this.$navigate('play?vid=xxx&cid=xxx');
     * ```
     */
    $navigate(pagename: string): void;

    /**
     * 跳转到指定页面, **替换页面，不产生历史**
     *
     * 本函数是`wx.redirectTo`的封装。跳转到指定页面，`pagename`可以带上`queryString`
     *
     * @param pagename 页面名称或页面的路径
     * @param config 传递给 `wx.redirectTo` api的参数(url会自动由`pagename`解析的结果填充)
     *
     * 示例：
     *
     * ```js
     * this.$redirect('calulator?result=98',{
     *  success: () => {
     *    // do something
     *  }
     * });
     * this.$redirect('pages/about/about');
     * ```
     */

    $redirect(pagename: string, config?: WechatMiniprogram.RedirectToOption): void;

    /**
     * 跳转到指定tabBar页面，并关闭其他所有非tabBar页面
     *
     * 本函数是`wx.switchTab`的封装。跳转到指定页面。路径**不可包含参数**
     *
     * @param pagename 页面名称或页面的路径
     * @param config 传递给 `wx.switchTab` api的参数(url会自动由`pagename`解析的结果填充)
     *
     * 示例：
     *
     * ```js
     * this.$switchTab('main?user=mrhope');
     * this.$switchTab('pages/about/about');
     * ```
     */

    $switchTab(pagename: string, config?: WechatMiniprogram.SwitchTabOption): void;

    /**
     * 关闭所有页面，打开到应用内的某个页面
     *
     * 本函数是`wx.reLaunch`的封装。跳转到指定页面。`pagename`可以带上`queryString`
     *
     * @param pagename 页面名称或页面的路径
     * @param config 传递给 `wx.reLaunch` api的参数(url会自动由`pagename`解析的结果填充)
     *
     * 示例：
     *
     * ```js
     * this.$launch('main');
     * this.$launch('function/calulator?result=98');
     * ```
     */
    $launch(pagename: string, config?: WechatMiniprogram.ReLaunchOption): void;

    /**
     * 返回上一页，`wx.navigateBack` 的封装
     *
     * @param delta 返回的层数，默认为`1`
     *
     * 示例：
     *
     * ```js
     * this.$back();
     * this.$back(2);
     * ```
     */
    $back(delta?: number): void;

    /**
     * 提前预加载指定页面 (会触发对应页面的 `onPreload` 声明周期)
     *
     * @param pagename 页面名称或页面的路径，可以带上`queryString`
     * 
     * 示例：
     * 
     * ```js
     * this.$preload('play?vid=xxx&cid=xxx');
     * this.$preload('/page/main?userName=xxx&action=xxx');
     * ```
     */
    $preload(pagename: string): void;

    /** 
     * 点击代理方法，绑定 `$route` 逻辑，在元素上声明 `data-url` 作为跳转地址，支持切面方法：
     *
     * - `data-before` 跳转前执行
     * - `data-after`  跳转后执行
     * 
     * 示例：
     * ```html
     * <button
     *   bindtap="$bindRoute"
     *   data-url="/pages/play"
     *   data-before="onClickBefore"
     * >click redirect</button>
     * ```
     */
    $bindRoute(): void;

    /** 
     * 点击代理方法，绑定 `$redirect` 逻辑，在元素上声明 `data-url` 作为跳转地址，支持切面方法：
     *
     * - `data-before` 跳转前执行
     * - `data-after`  跳转后执行
     * 
     * 示例：
     * ```html
     * <button
     *   bindtap="$bindRedirect"
     *   data-url="/pages/play"
     *   data-before="onClickBefore"
     * >click redirect</button>
     * ```
     */
    $bindRedirect(): void;

    /** 
     * 点击代理方法，绑定 `$switch` 逻辑，在元素上声明 `data-url` 作为跳转地址，支持切面方法：
     *
     * - `data-before` 跳转前执行
     * - `data-after`  跳转后执行
     * 
     * 示例：
     * ```html
     * <button
     *   bindtap="$bindSwitch"
     *   data-url="/pages/play"
     *   data-before="onClickBefore"
     * >click redirect</button>
     * ```
     */
    $bindSwitch(): void;

    /** 
     * 点击代理方法，绑定 `$launch` 逻辑，在元素上声明 `data-url` 作为跳转地址，支持切面方法：
     *
     * - `data-before` 跳转前执行
     * - `data-after`  跳转后执行
     * 
     * 示例：
     * ```html
     * <button
     *   bindtap="$bindReLaunch"
     *   data-url="/pages/play"
     *   data-before="onClickBefore"
     * >click redirect</button>
     * ```
     */
    $bindReLaunch(): void;
  }

  interface Cache {
    /**
     * 如果传 `callback` 参数，会使用异步模式并回调，否则直接同步返回结果。
     *
     * @param key 
     * @param value 缓存数据，可以为对象
     * @param expire 缓存过期时间，单位为毫秒。如果为 true ，那么保持已存在的缓存时间，如果没有缓存，那么认为过期，不保存
     * @param callback 可选，异步写的时候回调，接收参数：cb(err), err不为空代表失败。
     */
    set(
      key: string, value: any, expire?: number | true,
      callback?: (errMsg: any) => void
    ): void;

    /**
     * 如果传 `callback` 参数，会使用异步模式并回调
     *
     * @param key 存储的键值
     * @param callback 可选，异步读的时候回调，接收参数：`calbck(err, data)`, `err`不为空代表失败
     */
    get(key: string, callback?: (err: any, data: any) => void): void;

    /**
     * 如果传 `callback` 参数，会使用异步模式并回调
     *
     * @param key 需要删除的键值
     * @param callback 可选，异步删除的时候回调，接收参数：`callback(err, data)`, `err`不为空代表失败
     */
    remove(key: string, callback?: () => void): void;
  }

  interface Stack {
    /**
     * 获取当前页面实例。取 getCurrentPages 的最后一个项。
     * 
     * @returns 当前页面的页面名
     */
    $curPage(): PageInstance;

    /**
     * 获取当前页面实例对应的页面名。根据`AppOption.config.route`的配置解析当前页面实例的`route`
     *
     * Notice: 由于基础库1.2.0以下不支持 `Page.prototype.route` ，只能取到空字符串
     * 
     * @returns 当前页面的页面名
     */
    $curPageName(): string;
  }

  /** 页面注册选项 */
  interface PageOption {
    /**
     * 在App.onLaunch触发时调用
     *
     * @param options 启动参数：
     *
     * - `path`  String  打开小程序的路径
     * - `query` Object  打开小程序的query
     * - `scene` Number  打开小程序的场景值
     */
    onAppLaunch(options: WechatMiniprogram.App.LaunchShowOption): void;

    /**
     * App.onShow 第一次触发时调用。
     *
     * 只会触发一次，需要多次调用的请使用原生的 App.onShow
     *
     * @param options 启动参数：
     *
     * - `path`  String  打开小程序的路径
     * - `query` Object  打开小程序的query
     * - `scene` Number  打开小程序的场景值
     */
    onAppShow(options: WechatMiniprogram.App.LaunchShowOption): void;

    /**
     * App.onShow 第一次触发时调用。
     *
     * 只会触发一次，需要多次调用的请使用原生的 App.onShow
     *
     * @param options 启动参数：
     *
     * - `path`  String  打开小程序的路径
     * - `query` Object  打开小程序的query
     * - `scene` Number  打开小程序的场景值
     */
    onAwake(time: WechatMiniprogram.App.LaunchShowOption): void;

    /**
     * 页面预加载时触发，此时对应的页面并未被加载
     *
     * 需要在调用页面中使用`this.preload(pageName或pageShortName)`
     */
    onPreload(options: PageLifeTimeOptions): void;

    /**
     * 页面即将被导航时触发
     *
     * 需要在调用页面中使用`this.$navigate(pageName或pageShortName)`
     * 才能正确触发`onNavigate`
     *
     * 另外需要特别注意第一次进入一个分包界面
     * 或者是通过微信小程序二维码或微信内分享直接跳转到小程序子页面时同样不会触发
     */
    onNavigate(options: PageLifeTimeOptions): void;
  }


  /** 页面实例 */
  interface PageInstance extends Message, Redirector, Cache, Stack {
    /** 当前页面名称 */
    $name: string;

    /** 一些由wxpage生成的页面状态 */
    $state: {
      /** 是否是打开的第一个页面 */
      firstOpen: boolean;
    };

    /** 页面与页面内组件间的事件监听 */
    $emitter: Emitter;

    // TODO: Remove
    $session: Cache;

    /** 指定了 `ref` 的子组件实例Map */
    $refs: any;
  }

  /** 页面构造器 */
  interface PageConstructor {
    (
      name: string,
      options: PageOption
    ): void;
  }

  /** 组件实例 */
  interface ComponentInstance<D extends WechatMiniprogram.Component.DataOption>
    extends Message, Redirector, Cache, Stack {
    /** TODO: Remove
     *
     * 同 this.setData({...})
     *
     * @param options 同setData的第一项
     */
    $set(options: Partial<D> & Record<string, any>): void;

    /** TODO: Remove
     *
     * 获取data对象
     */
    $data(): D;

    /**
     * 通过消息的方式调用父组件方法，方法不存在也不会报错
     *
     * @param method 方法名称
     * @param args 传递的参数
     */
    $call(method: string, ...args: any[]): void;

    // TODO: Remove
    $session: Cache;

    /** 页面与页面内组件间的事件监听 */
    $emitter: Emitter;

    /** 当前组件所属的页面组件实例 只在 `attached`, `ready`生命周期后生效 */
    $root: any;

    /** 
     * 当前组件所属的父组件实例引用 只在 `attached`, `ready`生命周期后生效 
     * 
     * 在非连续调用组件的情况下`$root`相同
     */
    $parent: any;

    /** 
     * 指定了 ref 的子组件实例Map，在父组件获取子组件引用 
     * 
     * 示例：
     * 
     * ```html
     * <custom-component binding="$" ref="customComp"/>
     * ```
     * 
     * ```js
     * Page.P({
     *   onLoad: function () {
     *     this.$refs.customComp // 根据ref属性获取子组件的实例引用
     *   }
     * });
     * ```
     */
    $ref: any;
  }

  /** APP选项 */
  interface AppOption {
    /** 小程序路径解析配置 */
    config: {
      /** 小程序路径 */
      route: string | string[];

      /**
       * 解析简称
       *
       * @param name 页面简称
       * @returns 实际页面的地址
       */
      resolvePath?(name: string): string;

      /**
       * 自定义扩展页面，在框架执行扩展之前
       *
       * @param name 页面名称
       * @param def pageoption
       * @param modules 内置模块
       */
      extendPageBefore?(name: string, def: PageOption, modules: any): void;

      /**
       * 自定义扩展页面，在框架执行扩展之后
       *
       * @param name 页面名称
       * @param def pageoption
       * @param modules 内置模块
       */
      extendPageAfter?(name: string, def: PageOption, modules: any): void;

      /**
       * 自定义扩展组件，在框架执行扩展之前。例如为每个组件挂在一个实例方法
       *
       * @param def pageoption
       */
      extendComponentBefore?(def: any): void;
    };

    /**
     * 小程序在切入后台后被唤醒
     *
     * @param time 休眠时间(单位ms)
     */
    onAwake?(time: number): void;
  }

  /** 组件实例 */
  interface ComponentOption {
    // TODO: Remove
    $set?(options: Record<string, any>): void;
  }
}

declare namespace WechatMiniprogram {
  namespace Page {
    type WXInstance<
      D extends DataOption,
      C extends CustomOption> = WXPage.PageInstance & Instance<D, C>

    type WXOption<
      D extends DataOption,
      C extends CustomOption> =
      Partial<WXPage.PageOption> &
      ThisType<WXInstance<D, C>> &
      Options<D, C>;

    interface WXConstructor {
      <D extends DataOption,
        C extends CustomOption>(
        name: string,
        options: WXOption<D, C>
      ): void;
    }
  }

  namespace Component {
    type WXInstance<D extends DataOption,
      P extends PropertyOption,
      M extends MethodOption> = WXPage.ComponentInstance<D> & Instance<D, P, M>;

    type WXOption<D extends DataOption,
      P extends PropertyOption,
      M extends MethodOption> =
      ThisType<WXInstance<D, P, M>> &
      Options<D, P, M>;

    interface WXConstructor {
      <
        D extends DataOption,
        P extends PropertyOption,
        M extends MethodOption>(
        options: WXOption<D, P, M>
      ): string;
    }
  }

  namespace App {
    type WXInstance<T extends IAnyObject> = Option & T;

    type WXOption<T extends IAnyObject> =
      Partial<WXPage.AppOption> & Partial<Option> &
      T & ThisType<WXInstance<T>>;

    interface WXConstructor {
      <T extends IAnyObject>(options: WXOption<T>): void;
    }

    interface GetApp {
      (opts?: GetAppOption): WXInstance<IAnyObject>;
    }
  }
}

declare module 'wxpage' {
  interface WXPage extends WechatMiniprogram.Page.WXConstructor, WXPage.Emitter {
    A: WechatMiniprogram.App.WXConstructor;
    C: WechatMiniprogram.Component.WXConstructor;
  }

  const wxpage: WXPage;
  export default wxpage;
}