# JavaScript

## 闭包原理/优点/缺点/使用场景

1. 什么是闭包（外层函数调用时，外层函数的函数作用域对象被内层函数引用着，无法释放，就形成了闭包。）
   - 函数嵌套函数
   - 内层函数中使用了外层函数的变量或参数
   - 内层函数作为返回值返回到外部
2. 优缺点
   优点：
   - 保护具有共享意义的变量
   - 隔离作用域 避免(全局)作用域污染
   - 为变量提供访问和操作的相关接口
   - 便于进行模块化开发
   - 减少形参个数，延长了形参的生命周期
     缺点： 占用过多的资源(内存) 大量使用不利于代码优化 【解决方式：清除变量】
3. 闭包的应用场景
   - 通过循环给页面上多个 dom 节点绑定事件
   - 封装私有变量(计数器)
   - 延续局部变量的寿命
   - 高阶组件
   - [函数防抖/节流](#防抖节流)
   - [柯里化](#函数柯里化)
4. 闭包原理
   内层函数通过作用域链使用了外层函数的变量或参数，从而导致内存无法释放，需要手动设置为 null 进行清除
   模块化就是以闭包为基础构建的;

## promise

- ES6-Promise(承诺)
  Promise 异步编程的一种解决方案，比传统的解决方案（回调函数）更合理和更强大。
  Promise 可以解决回调地狱的问题
- 状态
  Promise 对象代表一个异步操作，有三种状态：pending 进行中、fulfilled(resolve)成功、rejected 失败
  Promise 一旦状态设定，就不会再变.
  Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected,只要这两种情况发生，状态就凝固了。
- 编写 promise

```js
let promise = new Promise((resolve, reject) => {
  //resolve 成功 reject 失败
  resolve(); //设定成功，找 promise 下面的 then 方法,resolve 传递参数值给 then
  reject(); //设定失败，找 promise 下面的 catch 方法,reject 传递参数值给 catch
});
```

- promise 原型下面两个方法

  - then 方法的作用：resolve 函数将 Promise 对象的状态从“未完成”变为“成功”，找 then 方法，将 resolve 函数的参数值传递给 then 方法。
  - catch 方法的作用：reject 函数将 Promise 对象的状态从“ 未完成” 变为“ 失败”，找 catch 方法，将 reject 函数的参数值传递给 catch 方法。

```js
promise
  .then((data) => {
    console.log("11111111");
  })
  .catch(() => {
    console.log("22222222");
  });
```

Promise.all():用于将多个 Promise 实例，包装成一个新的 Promise 实例，所有的 promise 成功才成功，只要有一个失败了那就是失败 使用场景：发送多个请求并根据请求顺序获取和使用数据
Promise.race():是一个数组，返回一个新的 promise，第一个完成的状态就是结果状态

- 缺点：
  一旦新建立即执行，无法中途取消
  pending 状态时，无法知道当前处于哪一个状态，是开始还是结束
  不设置回调，内部抛出的错误，不会反应到外部

## 设计模式 - 发布订阅模式 - 单例模式

发布 — 订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

发布订阅模式的基础实现

```JS
  // 利用发布订阅模式实现自定义事件(买菜，买车，买房子...)
  // 例如：买菜 - 买青菜，买白菜，买番茄.....
  // this.message['买菜'] = [function(){买青菜},function(){买白菜}...]
  // this.message['买车'] = [function(){买宝马},function(){买奔驰}...]
  // this.message['买房'] = [function(){买别墅},function(){买大平层}...]
  // 买菜：事件类型   +  事件处理函数

  //利用Observer进行自定义事件的开发。
  //添加事件 - on
  //执行事件 - emit
  //删除事件 - remove
class Ob {
    constructor() {
      this.message = []; //记录事件的记事本
    }
    // 添加事件 - on
    // type:事件类型  fn:事件处理函数。 type事件类型存在追加，不存在创建。
    on(type, fn) {
      if (!this.message[type]) {
        //不存在创建
        this.message[type] = [fn];
      } else {
        //存在追加
        this.message[type].push(fn);
      }
    }
    // 执行事件 - emit
    emit(type) {
      if (!this.message[type]) return; //事件类型不存在，退出
      this.message[type].forEach((item) => {
        item();
      });
    }
    // 删除事件 - remove - 事件类型，那个事件处理函数
    remove(type, fn) {
      if (!this.message[type]) return; //事件类型不存在，退出
      for (let i = 0; i < this.message[type].length; i++) {
        if (this.message[type][i] == fn) {
          this.message[type].splice(i, 1); //改变原数组
          i--;
        }
      }
    }
  }

  function fn1() {
    console.log("买奔驰");
  }

  function fn2() {
    console.log("买宝马");
  }

  function fn3() {
    console.log("买奥迪");
  }

  function fn4() {
    console.log("买白菜");
  }
  let observer = new Ob();
  observer.on("买车", fn1); //绑定事件
  observer.on("买车", fn2);
  observer.on("买车", fn3);
  observer.on("cai", fn4);

  observer.remove("买车", fn2); //删除事件

  observer.emit("买车"); //执行事件
  observer.emit("cai");
```

单例模式
单例模式就是一个实例在整个网页的生命周期里只创建一次，后续再调用实例创建函数的时候，返回的仍是之前创建的实例。在实际开发中应用十分广泛，例如页面中的登录框，显示消息的提示窗

## Es6 新增了那些语法

```
1. let 和 const
2. 解构赋值 let{一一对应} = {一一对应}
3. 扩展运算符... 将数组拆分成一个一个数字的形式
4. 模板字符串 ``
5. 箭头函数 ()=>{}
6. promise 概述和应用
7. class 面向对象的一种写法 比原型+构造函数好
8. 模块化 - export/import/解构赋值
9. async+await promise 的语法糖
10. for...of... 最好的遍历方式 不能遍历对象 遍历对象用 for in
11. 对象的简写风格

- 如果属性名和属性值名称相同，写一个。
- 属性值是函数可以省略 function
```

### let const var 区别

```
- let 关键字 - 重点
- 块作用域，声明的变量绑定在这个区域里面。
- 不存在变量提升(暂时性死区：先声明再使用)。
- 相同的作用域内不能重复声明(熟悉报错:Identifier 'a' has already been declared)

  - var 关键字
  - 局部和全局作用域，函数内部是局部，函数外面是全局。
  - 变量提升
  - 相同的作用域内可以重复声明
  - 预解析(1.预编译 var,function 2.代码逐行执行)
  - var 声明的变量也是 window 的属性

  - const 关键字 - 重点
  - 声明的常量值不能被改变
  - 对象的值不能改变，对象里面的属性可以改变的。
  - 使用场景(存储不变的值，存储函数，存储元素对象，存储对象)
```

### 箭头函数和普通函数有什么差异？

```
1. 相比普通函数更简洁的语法
2. 没有 this,捕获其所在上下文的 this 值，作为自己的 this 值
3. 不能使用 new,箭头函数作为匿名函数,是不能作为构造函数的,不能使用 new
4. 不绑定 arguments，用 rest 参数...解决
   let test3=(...a)=>{console.log(a[1])} //22
5. 使用 call()和 apply()调用:由于 this 已经在词法层面完成了绑定，通过 call() 或 apply() 方法调用一个函数时，只是传入了参数而已，对 this 并没有什么影响：
6. 箭头函数没有原型属性
7. 不能简单返回对象字面量
   let fun5 = ()=>({ foo: x }) //如果 x => { foo: x } //则语法出错
8. 箭头函数不能当做 Generator 函数,不能使用 yield 关键字
9. 箭头函数不能换行
   let a = ()
   =>1; //SyntaxError: Unexpected token =>
   使用箭头函数应该注意什么？
10. 不要在对象里面定义函数，对象里面的行数应该用传统的函数方法
11. 不要在对原型对象上定义函数，在对象原型上定义函数也是遵循着一样的规则
12. 不要用箭头定义构造函数
13. 不要用箭头定义事件回调函数
```

### promise async await 以及两者区别

```
    /*---------Promise概念：---------*/

Promise 是用来做异步的，Promise 好比容器，里面存放着一些异步的事件的结果，而这些结果一旦生成是无法改变的
Promise 的出现解决了传统 callback 函数导致的“地域回调”问题
/_---------async await 概念：---------_/
async await 也是异步编程的一种解决方案，拥有 promise 的风格，他遵循的是 Generator 函数的语法糖，他拥有内置执行器，不需要额外的调用直接会自动执行并输出结果，async 修饰过的函数也有 then 和 catch ⽅法，await 只能放在 async 中，只能修饰 promise 对象
它返回的是一个 Promise 对象。
两者的区别：
Promise 的出现解决了传统 callback 函数导致的“地域回调”问题，但它的语法导致了它向纵向发展行成了一个回调链，遇到复杂的业务场景，这样的语法显然也是不美观的。而 async await 代码看起来会简洁些，使得异步代码看起来像同步代码，await 的本质是可以提供等同于”同步效果“的等待异步返回能力的语法糖，只有这一句代码执行完，才会执行下一句。
async await 与 Promise 一样，是非阻塞的。
async await 是基于 Promise 实现的，可以说是改良版的 Promise，它不能用于普通的回调函数。
```

### for in. for of 的区别

```
1. for...in 循环：只能获得对象的键名，不能获得键值，for...of 循环：允许遍历获得键值
2. 对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错，可以使用 for...in 循环遍历键名
3. for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键。for...of 则不会这样
4. 无论是 for...in 还是 for...of 都不能遍历出 Symbol 类型的值，遍历 Symbol 类型的值需要用 Object.getOwnPropertySymbols() 方法（可以不说）

```

## 异步解决方案有哪些？ - 回调函数 callback Promise Generator

```
1.回调函数 callback：回调地狱：多个回调函数嵌套的情况，使代码看起来很混乱，不易于维护。 2.事件发布订阅:消耗内存，过度使用会使代码难以维护和理解
3.Promise:无法取消 promise。如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。当处于 Pending 状态时，无法得知目前进展到哪一个阶段
4.Generator:Generator 是 es6 提出的另一种异步编程解决方案，需要在函数名之前加一个*号，函数内部使用 yield 语句。Generaotr 函数会返回一个遍历器，可以进行遍历操作执行每个中断点 yield,不能自动执行异步操作，需要写多个 next()方法.
5.async/await:es2017 引入的异步操作解决方案，可以理解为 Generator 的语法糖，最重要的好处是同步编程风格,async 函数返回一个 Promise。内置执行器，比 Generator 操作更简单。async/await 比*yield 语义更清晰。返回值是 Promise 对象，可以用 then 指定下一步操作。代码更整洁。可以捕获同步和异步的错误。

```

## 什么是事件委托 什么是事件冒泡

```

```

事件流：事件流就是事件冒泡和事件捕获
事件冒泡：事件开始时由最具体的元素接收(操作元素)，然后逐级向上传播到较为不具体的节点,一直到文档 document
事件捕获：反过来从最不具体的到最具体的

事件委托就是将自身要添加的事件委托给其他元素 从而实现相同的效果
原生 js 里面添加事件委托是 addEventListener 移出是 removeEventListener
事件委托的优缺点：
优点：减少事件注册次数，节约内存，提升性能。
缺点：所有事件都用事件代理，可能会出现事件误判。即本不该被触发的事件被绑定上了事件。

```

```

## 事件轮询

```
    事件轮询

执行完一个宏任务，询问一次微任务队列，微任务队列有任务，就清空微任务队列，循环往复
调用栈：执行代码的地方
轮询：轮流询问宏任务队列和微任务队列
宏任务：script 整体代码，setTimeout setInterval
微任务：promise 下面的 then
同步代码：script 代码 除了下面的异步代码都是同步代码
异步代码：定时器 promise 的 then ajax
WEB API :提供了异步机制 分配代码去哪个队列
事件轮询首先第一次执行宏任务把 script 代码放入调用栈调用（调用栈就是执行代码的地方） 同步代码直接输出异步代码则放入 WEB API （提供了异步机制 分配代码去哪个队列）webapi 分配完任务进行事件轮询（轮询轮流访问宏任务和微任务）然后执行微任务再把微任务的代码放到调用栈调用 在执行 同步输出异步 webapi 在分配直达调用栈和 webapi 和队列都为空事件轮询就结束了 这就是整个事件轮询的执行过程

```

## 本地存储 缓存

```
1.存储大小
   cookie 数据大小不能超过 4k。
   sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。
2.有效时间
   localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
   sessionStorage 数据在当前浏览器窗口关闭后自动删除。
   cookie 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭
3. 数据与服务器之间的交互方式
   cookie 的数据会自动的传递到服务器，服务器端也可以写 cookie 到客户端
   sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。
···
cookie 验证不安全易遭到 CSRF 攻击：
当你当前网站没有退出，而恰好漏洞网站又已你当前网站为漏洞，并添加转账信息或各种增删改查信息等，你的数据就会被篡改，导致不安全，CSRF 攻击是攻击者利用用户的身份操作用户帐户的一种攻击方式。
方法：
通常使用 Anti CSRF Token 来防御 CSRF 攻击，同时要注意 Token 的保密性和随机性。
1、尽量使用 POST，限制 GET
2、将 cookie 设置为 HttpOnly
3、增加 token
4、并且 CSRF 攻击问题一般是由服务端解决。

```

## get 和 post 的区别

```
1. 语义化：get 获取 post 传输
2. 数据长度：get 地址栏，地址栏仅能传输 2000 多个字符，post 理论上无限。
3. 安全性：get 不安全，地址栏显示，post 安全。
4. 传输数据：get 通过地址栏?和& post 通过请求头和 send 方法
5. 缓存问题：get 有缓存，post 没有缓存。
   清除缓存：浏览器设置 - 清除数据。 快捷方式：ctrl+h 左侧查看清除按钮

```

## http 请求过程

```
http 请求流程
浏览器端，客户端，前端
1.输入域名，比如https://www.taobao.com
2.域名解析，将域名和服务器对应的 ip 地址绑定在一起。
3.通过对应的端口找到程序的入口。
4.将程序解析成浏览器设别的语言(html,css,javascript)
5.返回给用户使用
服务器端，后端
服务器端的代码来自哪里，开发完成后，通过 ftp 工具将开发的代码传到服务器中，需要用户名和密码。

```

## http 状态码

```
200：成功，所有数据都在响应主体中
300：有多个资源地址，选择要访问的资源便可链接过去
301:被请求的资源已经永久移动到新位置
302:请求的资源临时从不同的 url 响应请求
304：如果客户端发送了⼀个带条件的请求，请求被允许后⽂档内容却没有改变
400:请求参数错误
401:未授权，请登录
403:跨域拒绝访问
404:请求失败，请求的资源在服务器上没有被找到
408:请求超时
500：通常为服务器源代码出错⽽⽆法响应请求
501:error.message = 服务未实现;
502:网关错误;
503:服务不可用;
504:网关超时;

```

## 什么是跨域?

```
所谓的同源是指，域名、协议、端口均为相同。
所谓的跨域，不同的域名、协议、端口皆为不同域
一个域与另一个域名、协议或者端口不同的域的之间访问都叫跨域
解决跨域的方法和方案：
1：通过配置环境。
2：第二种：jsonp 跨域
1. jsonp 跨域就是利用 script 标签的跨域能力请求资源
2. 浏览器的同源策略限制了 js 的跨域能力，但没有限制 link img iframe script 的跨域行为
实现方式：
1. 利用 js 创建一个 script 标签，把 json 的 url 赋给 script 的 scr 属性，
2. 把这个 script 插入到页面里，让浏览器去跨域获取资源
3. JS 先声明好回调函数，插入页面后会代为执行该函数，并且传入 json 对象为其参数。
注意：
1. jsonp 只针对 get 请求
2. script 标签加载回来的资源会被当成 js 在全局执行
3：CORS 跨域资源共享 - 后端代理
它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制用户参与
对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全一样
实现 CORS 通信的关键是服务器，只要服务器实现了 CORS 接口，就可以跨源通信
4：nginx 代理跨域
通过 nginx 服务器转发跨域请求，达到跨域的目的

```

## 六大对象 (数组字符串方法) ctrl+单击打开链接

```
file:///C:/phpStudy/WWW/html5-2/practice/project/%E5%85%AD%E5%A4%A7%E5%AF%B9%E8%B1%A1.html

```

## 数组去重的方法

```
   const arr = [1, 2, 3, 3, 3, 4, 5, 5, 5, 6, 6, 6, 6, 7, 8, 9, 9];
**1.利用 set 数据结构里面没有重复的项的特点定义一个新数组用扩展运算符后面接一个 newSet 外面包一个[]在赋值给一个新数组 return 出去**
      function one(arr) {
      let newarr = [...new Set(params)];
      return newarr;
      }
**2.遍历数组 并且把每一项 push 到新数组中去 push 的时候做判断 如果新数组中没有这项就 push 用 indexOf(item)=== -1 做判断**
      function two(params) {
      let newarr = [];
      params.forEach((item) => {
      if (newarr.indexOf(item) === -1) {
      newarr.push(item);
      }
      });
      return newarr;
      }
**3.利用两层 for 循环 第一层直接遍历 第二层从 i+1 开始遍历 就是吧数组中的一项和数组中的每一项做对比 如果有一样的 那么就截取掉**
      function three(params) {
      let arr = params;
      for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === arr[i]) {
      arr.splice(j, 1);
      j--;
      }
      }
      }

         return arr;

      }
**4.利用 filter 筛选 筛选索引 如果 indexof(item)等于 index 原理是 indexOf 是从前往后找 找到了之后他就不找了 如果这时候做个比较 只有相等的时候满足条件就可以去重了**
      function four(params) {
      return params.filter((item, index) => {
      return params.indexOf(item) === index;
      });
      }
**5.两层 for 循环 吧数组中的一项和数组中的每一项做对比 重复的把 flag 赋值为 2 下面做个判断 当 flag 为 1 的时候才 push**
      function five(item) {
      var newarr = []; //去重后新的数组
      for (var i = 0, len1 = arr.length; i < len1; i++) {
      var flag = 1; //标记
      //arr 的一项和所有的 newarr 里面的数组项进行比较
      for (var j = 0, len2 = newarr.length; j < len2; j++) {
      if (arr[i] === newarr[j]) {
      //满足条件，新数组里面存在。不需要的
      flag = 2;
      break;
      }
      }
      //如果到这里 flag=1,不满足上面的 if 判断，新数组不存在，需要的
      if (flag === 1) {
      newarr.push(arr[i]);
      }
      }
      return newarr;
      }
**对象数组去重原理第一层直接遍历 第二层从 i+1 开始遍历 就是吧数组中的一项的 key 和数组中的每一项的 key 做对比 如果有一样的 那么就截取掉这一项**
      var arr2 = [
      {
      key: "01",
      value: "乐乐",
      },
      {
      key: "02",
      value: "博博",
      },
      {
      key: "03",
      value: "淘淘",
      },
      {
      key: "04",
      value: "哈哈",
      },
      {
      key: "01",
      value: "乐乐 1",
      },
      {
      key: "02",
      value: "博博",
      },
      {
      key: "03",
      value: "淘淘",
      },
      {
      key: "04",
      value: "哈哈",
      },
      ];
      function obj(item) {
      for (let i = 0; i < item.length; i++) {
      for (let j = i + 1; j < item.length; j++) {
      if (item[j].key === item[i].key) {
      item.splice(j, 1);
      j--;
      }
      }
      }
      return item;
      }

```

## 类数组概念 怎么转换成真正的数组？

```
_也叫伪数组，在 js 中有一些对象它也拥有 length 属性，且拥有为非负整数的属性(索引)，但是它又不能调用数组的方法，这种对象被称为类数组对象_

**类数组转换成真正的数组**

1. let 定义一个类数组 把类数组拆分成一系列用逗号隔开的值 arr =[一系列用逗号隔开的值]

2. Array.from()方法用于将对象转为真正的数组(类数组转数组)

3. 遍历类数组 将取到的每一项值添加到新数组

```

## js 数据类型检测

```
1.typeof 引用数据类型（如：Array）是不起作用的。
2.instanceof 检测基本数据类型的话会返回 false 引用数据类型则会是 true 但是用 new 关键字 new 出来的基本数据类型是可以的
3.constructor 声明了一个构造函数，并且把他的原型指向了其他类型的原型 这种情况下会失效
4.Object.prototype.toString.call() - 最好的数据类/型检测方式

```

## this 指向哪里

```
1. 普通函数的 this 指向调用这个函数的对象，默认是 window
2. 构造函数的 this 指向 new 出来的实例对象，而且优先级是最高的，不能被改变
3. 箭头函数的 this 指向的是它外面的第一个不是箭头函数的函数的 this， 在定义时就确定了，不能被改变
4. 事件处理函数的 this 指向事件对象

```

## 如何改变 this 指向

```
1.利用 call,apply,bind 改变 this 的指向。
2.利用变量将正确的 this 存储为变量。
3.new 关键字改变 this 的指向。
4.箭头函数

```

## call, apply, bind 区别

```
- call 和 apply 都是为了解决改变 this 的指向。作用都是相同的，只是传参的方式不同。
- 除了第一个参数外，call 可以接收一个参数列表，apply 只接受一个参数数组。
- bind 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 bind 实现柯里化。

```

## 常用的 git 命令

```
**git**
git 是目前世界上最先进分布式的版本控制系统
github 是一个仓库
**配置**

- 仓库账号的用户名和邮箱
  git config --global user.name '远程仓库的账号'
  git config --global user.email '远程仓库的邮箱'
  **上传本地文件**
  git init
  初始化
  git add index.html 或者 git add .
  提交到暂存区
  git commit -m 'init index.html'
  提交到本地仓库
  git status
  查看 git 的状态
  git diff
  查看版本的差别
  git log 或者 git log --pretty=oneline
  查看版本信息
  git reset HEAD^
  回退一个版本(回退到的是暂存区的版本)
  git reset --hard cc56901
  回退到指定版本
  git reflog
  查看所有的历史版本
  **分支**
  git branch
  查看分支
  git branch dev
  创建分支
  git checkout dev 或者 git switch dev
  切换分支
  git checkout -b dev2
  创建并切换
  git merge dev2
  合并分支内容
  git branch -d dev2
  删除分支
  git log --graph --pretty=oneline
  查看分支记录
  **关联远程仓库**
  生成密钥对
  ssh-keygen -t rsa -C 'pudge_wj@163.com'
  创建项目
  git init
  git add .
  git commit -m 'init'
  git remote add origin git@github.com:pudge-w/taobao.git
  git push -u origin master
  邀请组员
  setting -> manage access
  组员开发
  不要在 master 做开发!!!!
  git checkout -b zhengguo
  git add .
  git commit -m 'xxx'
  git pull
  git push
  组长
  git fetch --all
  git checkout zhengguo
  git pull
  git checkout master
  git merge zhengguo
  git push

```

## 垃圾回收机制

```
垃圾回收方式
① 标记清除
工作原理：是当变量进入环境时，将这个变量标记为“进入环境”。当变量离开环境时，则将其标记为“离开环境”。标记“离开环境”的就回收内存。
② 引用计数
工作原理：跟踪记录每个值被引用的次数。一旦没有引用，内存就直接释放了。
内存管理
什么时候触发垃圾回收？
垃圾回收器周期性运行，如果分配的内存非常多，那么回收工作也会很艰巨，确定垃圾回收时间间隔就变成了一个值得思考的问题。
1、合理的 GC 方案：(1)、遍历所有可访问的对象; (2)、回收已不可访问的对象。
2、GC 缺陷： (1)、停止响应其他操作；
3、GC 优化策略： (1)、分代回收（Generation GC）;(2)、增量 GC

```

## 深浅拷贝

```
浅拷贝,拷贝一级，如果是对象里面还有对象,无法解决
1.for… in… 循环
2.Object.assgin() 缺点：非常消耗性能 比如一个对象中某一个数据改变 会导致整个数据的地址改变 消耗内存 所以有了 immutable
3....扩展运算符
深拷贝
1.JSON.parse(JSON.stringify( )) 缺点：当对象的 value 是函数 或者 undefined 时会失效 2.用 for…in…+递归

```

## 什么是构造函数

```
构造函数是一种特殊的函数，用来在对象实例化时（new 关键字创建）初始化对象的成员变量。（也就是说用 new 关键字创建的）
new 做了什么：

- 1.在内存中创建一个空对象
- 2.让 this 指向这个新对象
- 3.执行构造函数里面的代码，给这个对象添加属性和方法
- 4.返回这个新对象（构造函数不需要 return）
  在 Java 语言中，构造函数具有以下特点：
- 构造函数必须与类的名字相同，并且不能有返回值（返回值也不能为 void）。
- 每个类可以有多个构造函数。当开发人员没有提供构造函数时，编译器在把源代码编译成字节码的过程中会提供一个没有参数默认的构造函数，但该构造函数不会执行任何代码。如果开发人员提供了构造函数，那么编译器就不会在创建默认的构造函数了。
- 构造函数可以有 0 个、1 个或 1 个以上的参数。
- 构造函数总是伴随着 new 操作一起调用，且不能由程序的编写者直接调用，必须要由系统调用。构造函数在对象实例化时会被自动调用，且只运行一次；而普通的方法是在程序执行到它时被调用，且可以被对象调用多次。
- 构造函数的主要作用是完成对象的初始化工作。
- 构造函数不能被继承，因此，它不能被覆盖，但是构造函数能够被重载，可以使用不同的参数个数或参数类型来定义多个构造函数。
- 子类可以通过 super 关键字来显式地调用父类的构造函数，当父类没有提供无参数的构造函数时，子类的构造函数中必须显式地调用父类的构造函数。如果父类提供了无参数的构造函数，此时子类的构造函数就可以不显式地调用父类的构造函数，在这种情况下编译器会默认调用父类提供的无参数的构造函数。当有父类时，在实例化对象时会先执行父类的构造函数，然后执行子类的构造函数。
- 当父类和子类都没有定义构造函数时，编译器会为父类生成一个默认的无参数的构造函数，给子类也生成一个默认的无参数的构造函数。此外，默认构造器的修饰符只跟当前类的修饰符有关（例如，如果一个类被定义为 public，那么它的构造函数也是 public）。

```

## 原型链

```
原型的概念
每一个函数都有一个 prototype（构造器的原型），指向另一个对象。
prototype 的所有属性和方法都会被构造函数的实例继承,我们可以把那些不变(公用)的属性和方法，直接定义在 prototype 对象属性上。
prototype 里面的 this 依然指向实例对象。 构造函数里面 this 指向实例对象。
原型链的概念
实例对象与原型(prototype)之间的连接,依靠另外一个属性**proto**(内置属性)
每个对象都有一个**proto**属性,原型链上的对象正是依靠这个属性连结在一起.
对象可以通过.prototype 去获取原型相面的方法 原型可以

```

## js 的几种模块规范

```
js 中现在比较成熟的有四种模块加载方案：

1. CommonJS 方案，它通过 require 来引入模块，通过 module.exports 定义模块的输出接口。这种模块加载方案是服务器端的解决方案，它是以同步的方式来引入模块的，因为在服务端文件都存储在本地磁盘，所以读取非常快，所以以同步的方式加载没有问题。但如果是在浏览器端，由于模块的加载是使用网络请求，因此使用异步加载的方式更加合适。
2. AMD 方案，这种方案采用异步加载的方式来加载模块，模块的加载不影响后面语句的执行，所有依赖这个模块的语句都定义在一个回调函数里，等到加载完成后再执行回调函数。require.js 实现了 AMD 规范。
3. CMD 方案，这种方案和 AMD 方案都是为了解决异步模块加载的问题，sea.js 实现了 CMD 规范。它和 require.js 的区别在于模块定义时对依赖的处理不同和对依赖模块的执行时机处理不同。
4. ES6 提出的方案，使用 import 和 export 的形式来导入导出模块。
   总结：首先 COMMONJS 规范是最早的规范，适合于服务器端，Node.js 这个环境来实现这个规范，第二个规范就是 AMD 规范因为 COMMONJS 是适用于服务器端的是同步的规范，而前端追寻的是异步的规范，于是就有了 AMD 规范，它是一个异步的模块规范，Require.js 库实现了这个规范。第三个就是 CMD 规范，是通用的模块规范，sea.js 的库来实现这个规范
   **_CommonJS 和 ES6 中的模块化的两者区别是？_**

- - CommonJS 支持动态导入，也就是 require(${path}/xx.js)，ES6 目前不支持，但是已有提案
  - CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而 ES6 是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
  - CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES6 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
  - ES6 会编译成 require/exports 来执行的

```

## 防抖节流

```
1. 函数的防抖
   当事件被触发一段时间后再执行事件，如果在这段时间内事件又被触发，则重新计时。
2. 函数的节流
   函数节流（throttle）：指定时间间隔内，若事件被多次触发，只会执行一次.

```

## js 实现继承的方式有哪些

```
1.构造函数继承 核心：使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类（没用到原型）
2.原型链继承-----核心： 将父类的实例作为子类的原型\*\*
3.组合（混合）继承----核心：通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
4.class 继承----核心：class 是 ES6 新增的语法 直接 class 创建一个类，使用 extends 来继承
5.实例继承----核心：为父类实例添加新特性，作为子类实例返回
6 拷贝继承-----核心：Object.assign()用于对象的合并，将源对象的所有可枚举属性，复制到目标对象。
7.寄生组合继承----核心：通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点
```

## 严格模式下有哪些限制（规则）

```
1.变量必须声明后再使用
2.函数的参数不能有同名属性，否则报错
3.不能使用 with 语句
4.不能对只读属性赋值，否则报错
5.不能使用前缀 0 表示八进制数，否则报错
6.不能删除不可删除的属性，否则报错
7.不能删除变量 delete prop，会报错，只能删除属性 delete global[prop]
8.eval 不会在它的外层作用域引入变量
9.eval 和 arguments 不能被重新赋值
10.arguments 不会自动反映函数参数的变化
11.不能使用 arguments.callee
12.不能使用 arguments.caller
13.禁止 this 指向全局对象
14.不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈 15.增加了保留字（比如 protected、static 和 interface）
```

## 函数缓存的方法

```
高阶函数，
闭包
函数柯里化
```

## 内存泄漏是什么 内存泄露造成的原因

内存泄漏也称作"存储渗漏"，用动态存储分配函数动态开辟的空间，在使用完毕后未释放，结果导致一直占据该内存单元。直到程序结束
简单来说就是该内存空间使用完毕后未回收

**_内存泄露造成的原因_**

1. 单例造成的内存泄漏
2. 静态集合类
3. 资源未关闭造成的内存泄漏
4. 改变哈希值
5. 缓存泄露
6. 监听器和回调
7. 不合理的使用闭包

## 函数柯里化

柯里化（Currying）
柯里化（Currying）是一种关于函数的高阶技术。它不仅被用于 JavaScript，还被用于其他编程语言。

柯里化是一种函数的转换，它是指将一个函数从可调用的 f(a, b, c) 转换为可调用的 f(a)(b)(c)。

柯里化不会调用函数。它只是对函数进行转换。

让我们先来看一个例子，以更好地理解我们正在讲的内容，然后再进行一个实际应用。

我们将创建一个辅助函数 curry(f)，该函数将对两个参数的函数 f 执行柯里化。换句话说，对于两个参数的函数 f(a, b) 执行 curry(f) 会将其转换为以 f(a)(b) 形式运行的函数：

```JavaScript
function curry(f) { // curry(f) 执行柯里化转换
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}

// 用法
function sum(a, b) {
  return a + b;
}

let curriedSum = curry(sum);

alert( curriedSum(1)(2) ); // 3
```

正如你所看到的，实现非常简单：只有两个包装器（wrapper）。

curry(func) 的结果就是一个包装器 function(a)。
当它被像 curriedSum(1) 这样调用时，它的参数会被保存在词法环境中，然后返回一个新的包装器 function(b)。
然后这个包装器被以 2 为参数调用，并且，它将该调用传递给原始的 sum 函数。
柯里化更高级的实现，例如 lodash 库的 \_.curry，会返回一个包装器，该包装器允许函数被正常调用或者以偏函数（partial）的方式调用：

```JavaScript
function sum(a, b) {
  return a + b;
}

let curriedSum = _.curry(sum); // 使用来自 lodash 库的 _.curry

alert( curriedSum(1, 2) ); // 3，仍可正常调用
alert( curriedSum(1)(2) ); // 3，以偏函数的方式调用
```

柯里化？目的是什么？
要了解它的好处，我们需要一个实际中的例子。

例如，我们有一个用于格式化和输出信息的日志（logging）函数 log(date, importance, message)。在实际项目中，此类函数具有很多有用的功能，例如通过网络发送日志（log），在这儿我们仅使用 alert：

```JavaScript
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}

//让我们将它柯里化！

log = _.curry(log);

// 柯里化之后，log 仍正常运行：

log(new Date(), "DEBUG", "some debug"); // log(a, b, c)

// ……但是也可以以柯里化形式运行：

log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)

// 现在，我们可以轻松地为当前日志创建便捷函数：

// logNow 会是带有固定第一个参数的日志的偏函数
let logNow = log(new Date());

// 使用它
logNow("INFO", "message"); // [HH:mm] INFO message

// 现在，logNow 是具有固定第一个参数的 log，换句话说，就是更简短的“偏应用函数（partially applied function）”或“偏函数（partial）”。

// 我们可以更进一步，为当前的调试日志（debug log）提供便捷函数：

let debugNow = logNow("DEBUG");

debugNow("message"); // [HH:mm] DEBUG message
```

所以：

柯里化之后，我们没有丢失任何东西：log 依然可以被正常调用。
我们可以轻松地生成偏函数，例如用于生成今天的日志的偏函数。
高级柯里化实现
如果你想了解更多细节，下面是用于多参数函数的“高级”柯里化实现，我们也可以把它用于上面的示例。

它非常短：

```JavaScript
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}

// 用例：

function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6，仍然可以被正常调用
alert( curriedSum(1)(2,3) ); // 6，对第一个参数的柯里化
alert( curriedSum(1)(2)(3) ); // 6，全柯里化

// 新的 curry 可能看上去有点复杂，但是它很容易理解。

// curry(func) 调用的结果是如下所示的包装器 curried：

// func 是要转换的函数
function curried(...args) {
  if (args.length >= func.length) { // (1)
    return func.apply(this, args);
  } else {
    return function(...args2) { // (2)
      return curried.apply(this, args.concat(args2));
    }
  }
};
```

当我们运行它时，这里有两个 if 执行分支：

如果传入的 args 长度与原始函数所定义的（func.length）相同或者更长，那么只需要使用 func.apply 将调用传递给它即可。
否则，获取一个偏函数：我们目前还没调用 func。取而代之的是，返回另一个包装器 pass，它将重新应用 curried，将之前传入的参数与新的参数一起传入。
然后，如果我们再次调用它，我们将得到一个新的偏函数（如果没有足够的参数），或者最终的结果。

只允许确定参数长度的函数

柯里化要求函数具有固定数量的参数。

使用 rest 参数的函数，例如 f(...args)，不能以这种方式进行柯里化。

比柯里化多一点

根据定义，柯里化应该将 sum(a, b, c) 转换为 sum(a)(b)(c)。

但是，如前所述，JavaScript 中大多数的柯里化实现都是高级版的：它们使得函数可以被多参数变体调用。

总结
柯里化 是一种转换，将 f(a,b,c) 转换为可以被以 f(a)(b)(c) 的形式进行调用。JavaScript 实现通常都保持该函数可以被正常调用，并且如果参数数量不足，则返回偏函数。

柯里化让我们能够更容易地获取偏函数。就像我们在日志记录示例中看到的那样，普通函数 log(date, importance, message) 在被柯里化之后，当我们调用它的时候传入一个参数（如 log(date)）或两个参数（log(date, importance)）时，它会返回偏函数。
