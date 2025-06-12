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

### promise async await 以及两者区别

- Promise 概念：
  - Promise 是用来做异步的，Promise 好比容器，里面存放着一些异步的事件的结果，而这些结果一旦生成是无法改变的
  - Promise 的出现解决了传统 callback 函数导致的“地域回调”问题
- async await 概念：
  - async await 也是异步编程的一种解决方案，拥有 promise 的风格，他遵循的是 Generator 函数的语法糖，他拥有内置执行器，不需要额外的调用直接会自动执行并输出结果，async 修饰过的函数也有 then 和 catch ⽅法，await 只能放在 async 中，只能修饰 promise 对象.它返回的是一个 Promise 对象。
- 两者的区别：
  - Promise 的出现解决了传统 callback 函数导致的“地域回调”问题，但它的语法导致了它向纵向发展行成了一个回调链，遇到复杂的业务场景，这样的语法显然也是不美观的。而 async await 代码看起来会简洁些，使得异步代码看起来像同步代码，await 的本质是可以提供等同于”同步效果“的等待异步返回能力的语法糖，只有这一句代码执行完，才会执行下一句。
  - async await 与 Promise 一样，是非阻塞的。
  - async await 是基于 Promise 实现的，可以说是改良版的 Promise，它不能用于普通的回调函数。

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

### let const var 区别

- let 关键字

  - 块作用域，声明的变量绑定在这个区域里面。
  - 不存在变量提升(暂时性死区：先声明再使用)。
  - 相同的作用域内不能重复声明(熟悉报错:Identifier 'a' has already been declared)

- var 关键字

  - 局部和全局作用域，函数内部是局部，函数外面是全局。
  - 变量提升
  - 相同的作用域内可以重复声明
  - 预解析(1.预编译 var,function 2.代码逐行执行)
  - var 声明的变量也是 window 的属性

- const 关键字
  - 声明的常量值不能被改变
  - 对象的值不能改变，对象里面的属性可以改变的。
  - 使用场景(存储不变的值，存储函数，存储元素对象，存储对象)

### 箭头函数和普通函数有什么差异？

- 相比普通函数更简洁的语法
- 没有 this,捕获其所在上下文的 this 值，作为自己的 this 值
- 不能使用 new,箭头函数作为匿名函数,是不能作为构造函数的,不能使用 new
- 不绑定 arguments，用 rest 参数...解决
  let test3=(...a)=>{console.log(a[1])} //22
- 使用 call()和 apply()调用:由于 this 已经在词法层面完成了绑定，通过 call() 或 apply() 方法调用一个函数时，只是传入了参数而已，对 this 并没有什么影响：
- 箭头函数没有原型属性
- 不能简单返回对象字面量
  let fun5 = ()=>({ foo: x }) //如果 x => { foo: x } //则语法出错
- 箭头函数不能当做 Generator 函数,不能使用 yield 关键字
- 箭头函数不能换行
  ```JS
    let a = ()
    =>1; //SyntaxError: Unexpected token =>
  ```
- 使用箭头函数应该注意什么？
  - 不要在对象里面定义函数，对象里面的行数应该用传统的函数方法
  - 不要在对原型对象上定义函数，在对象原型上定义函数也是遵循着一样的规则
  - 不要用箭头定义构造函数
  - 不要用箭头定义事件回调函数

### for in. for of 的区别

```
1. for...in 循环：只能获得对象的键名，不能获得键值，for...of 循环：允许遍历获得键值
2. 对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错，可以使用 for...in 循环遍历键名
3. for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键。for...of 则不会这样
4. 无论是 for...in 还是 for...of 都不能遍历出 Symbol 类型的值，遍历 Symbol 类型的值需要用 Object.getOwnPropertySymbols() 方法（可以不说）

```

## 异步解决方案有哪些？ - 回调函数 callback Promise Generator

- 回调函数 callback：回调地狱：多个回调函数嵌套的情况，使代码看起来很混乱，不易于维护。
- 事件发布订阅:消耗内存，过度使用会使代码难以维护和理解
- Promise:无法取消 promise。如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。当处于 Pending 状态时，无法得知目前进展到哪一个阶段
- Generator:Generator 是 es6 提出的另一种异步编程解决方案，需要在函数名之前加一个\*号，函数内部使用 yield 语句。Generaotr 函数会返回一个遍历器，可以进行遍历操作执行每个中断点 yield,不能自动执行异步操作，需要写多个 next()方法.
- async/await:es2017 引入的异步操作解决方案，可以理解为 Generator 的语法糖，最重要的好处是同步编程风格,async 函数返回一个 Promise。内置执行器，比 Generator 操作更简单。async/await 比\*yield 语义更清晰。返回值是 Promise 对象，可以用 then 指定下一步操作。代码更整洁。可以捕获同步和异步的错误。

## 什么是事件委托 什么是事件冒泡

- 事件流：事件流就是事件冒泡和事件捕获
- 事件冒泡：事件开始时由最具体的元素接收(操作元素)，然后逐级向上传播到较为不具体的节点,一直到文档 document
- 事件捕获：反过来从最不具体的到最具体的

- 事件委托就是将自身要添加的事件委托给其他元素 从而实现相同的效果
  原生 js 里面添加事件委托是 addEventListener 移出是 removeEventListener
- 事件委托的优缺点：
  - 优点：减少事件注册次数，节约内存，提升性能。
  - 缺点：所有事件都用事件代理，可能会出现事件误判。即本不该被触发的事件被绑定上了事件。

## 事件轮询

- 概念：执行完一个宏任务，询问一次微任务队列，微任务队列有任务，就清空微任务队列，循环往复
- 调用栈：执行代码的地方
- 轮询：轮流询问宏任务队列和微任务队列
- 宏任务：script 整体代码，setTimeout setInterval
- 微任务：promise 下面的 then
- 同步代码：script 代码 除了下面的异步代码都是同步代码
- 异步代码：定时器 promise 的 then ajax
- WEB API :提供了异步机制 分配代码去哪个队列
  事件轮询首先第一次执行宏任务把 script 代码放入调用栈调用（调用栈就是执行代码的地方） 同步代码直接输出异步代码则放入 WEB API （提供了异步机制 分配代码去哪个队列）webapi 分配完任务进行事件轮询（轮询轮流访问宏任务和微任务）然后执行微任务再把微任务的代码放到调用栈调用 在执行 同步输出异步 webapi 在分配直达调用栈和 webapi 和队列都为空事件轮询就结束了 这就是整个事件轮询的执行过程

## 本地存储 缓存

- 存储大小
  cookie 数据大小不能超过 4k。
  sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。
- 有效时间
  localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
  sessionStorage 数据在当前浏览器窗口关闭后自动删除。
  cookie 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭
- 数据与服务器之间的交互方式
  cookie 的数据会自动的传递到服务器，服务器端也可以写 cookie 到客户端
  sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

cookie 验证不安全易遭到 CSRF 攻击：
当你当前网站没有退出，而恰好漏洞网站又已你当前网站为漏洞，并添加转账信息或各种增删改查信息等，你的数据就会被篡改，导致不安全，CSRF 攻击是攻击者利用用户的身份操作用户帐户的一种攻击方式。
方法：
通常使用 Anti CSRF Token 来防御 CSRF 攻击，同时要注意 Token 的保密性和随机性。

- 尽量使用 POST，限制 GET
- 将 cookie 设置为 HttpOnly
- 增加 token
- 并且 CSRF 攻击问题一般是由服务端解决。

## get 和 post 的区别

- 语义化：get 获取 post 传输
- 数据长度：get 地址栏，地址栏仅能传输 2000 多个字符，post 理论上无限。
- 安全性：get 不安全，地址栏显示，post 安全。
- 传输数据：get 通过地址栏?和& post 通过请求头和 send 方法
- 缓存问题：get 有缓存，post 没有缓存。
  清除缓存：浏览器设置 - 清除数据。 快捷方式：ctrl+h 左侧查看清除按钮

## http 请求过程

用户输入网址 → 域名解析 → 建立连接 → 发送 HTTP 请求 → 服务器处理 → 返回响应 → 浏览器渲染
http 请求流程
浏览器端，客户端，前端

- 用户在浏览器地址栏输入域名
  例如输入：https://www.taobao.com
- 域名解析（DNS 解析）
  浏览器首先检查本地缓存（浏览器 DNS 缓存、操作系统 DNS 缓存）是否有该域名的 IP 地址。
  如果没有，则向本地 DNS 服务器发起请求，逐级递归或迭代查询，最终获取到 www.taobao.com 对应的 IP 地址。
  域名和服务器的 IP 地址建立绑定关系。
- 建立 TCP 连接（三次握手）
  浏览器和目标服务器（如淘宝服务器）在目标端口（通常是 80/443）上建立 TCP 连接。
  HTTPS 协议还会有 TLS/SSL 握手过程，协商加密方式和密钥。
- 浏览器向服务器发送 HTTP 请求
  包括请求方法（GET/POST 等）、请求头（headers）、请求体（body，POST 时有）等。
  服务器处理请求，返回响应
  服务器收到请求后，查找对应的资源，处理业务逻辑，并生成响应内容（HTML、CSS、JS、图片等）。
- 浏览器接收响应，渲染页面
  浏览器解析返回的 HTML，遇到 CSS、JS、图片等资源会继续发起新的 HTTP 请求。
  解析和执行 CSS 样式、JavaScript 代码，最终渲染出完整的网页供用户交互。

## http 状态码

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

## 什么是跨域?

所谓的同源是指，域名、协议、端口均为相同。
所谓的跨域，不同的域名、协议、端口皆为不同域
一个域与另一个域名、协议或者端口不同的域的之间访问都叫跨域

**解决跨域的方法和方案：**

- 配置本地开发环境（环境代理）

  - **原理**：通过前端开发服务器（如 webpack-dev-server、Vite、create-react-app 等工具）配置 `proxy` 字段，将接口请求代理到后端服务器，实现“同源”效果，从而规避浏览器的同源策略限制。
  - **特点**：仅适用于本地开发环境，生产环境不可用。
  - **示例**（以 Vite 为例）：

    ```js
    // vite.config.js
    export default {
      server: {
        proxy: {
          "/api": "http://backend-server.com",
        },
      },
    };
    ```

---

- JSONP 跨域

  - **原理**：利用 `<script>` 标签不受同源策略限制的特点，通过动态创建 `<script>` 标签，加载携带参数的请求，服务器返回一段 JavaScript 代码并调用事先定义好的回调函数实现数据传递。
  - **实现步骤**：
    1. 前端声明一个全局回调函数。
    2. 动态创建 `<script>` 标签，将请求地址（带回调函数名参数）赋值给 `src` 属性。
    3. 插入页面，触发请求，服务端返回形如 `callback(data)` 的 JS 代码，自动执行。
  - **注意事项**：
    - 仅支持 GET 请求，无法处理 POST、PUT 等。
    - 服务器需要支持 JSONP 格式的响应。
    - 返回内容会作为 JS 脚本执行，有一定安全隐患。
  - **示例**：

    ```js
    function handleResponse(data) {
      console.log(data);
    }
    var script = document.createElement("script");
    script.src = "http://example.com/api?callback=handleResponse";
    document.body.appendChild(script);
    ```

---

- CORS（跨域资源共享，Cross-Origin Resource Sharing）

  - **原理**：服务器通过设置 `Access-Control-Allow-Origin` 等响应头，允许特定源的请求跨域访问资源。现代浏览器在发起跨域请求时会自动遵循 CORS 协议。
  - **特点**：
    - 支持多种 HTTP 方法（GET、POST、PUT、DELETE 等）。
    - 对开发者而言，前端代码和同源 AJAX 通信基本一致。
    - 需要后端服务器配合设置响应头。
  - **常见配置**（Node.js Express 示例）：

    ```js
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*"); // 允许所有域名
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      next();
    });
    ```

---

- Nginx 反向代理跨域

  - **原理**：通过 Nginx 服务器配置反向代理，将前端请求转发到目标后端服务器，实现跨域资源访问。前端与 Nginx 同源，Nginx 代前端发起请求。
  - **特点**：
    - 适用于生产环境，性能优良。
    - 不改变前端和后端代码，仅需配置 Nginx。
  - **示例配置**：

    ```nginx
    server {
      listen 80;
      server_name www.frontend.com;

      location /api/ {
        proxy_pass http://backend-server.com/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
      }
    }
    ```

---

- 其他常见的跨域解决方案

  - **后端中间件代理**：如 Node.js 的 http-proxy-middleware，原理类似于 Nginx 代理。
  - **WebSocket**：WebSocket 协议本身不受同源策略的限制，可以进行跨域通信。
  - **window.name、postMessage 跨域**：适用于 iframe 或多窗口间通信。

---

## 数组去重的方法

- 利用 set 数据结构里面没有重复的项的特点定义一个新数组用扩展运算符后面接一个 newSet 外面包一个[]在赋值给一个新数组 return 出去

```js
function one(arr) {
  let newarr = [...new Set(params)];
  return newarr;
}
```

- 遍历数组 并且把每一项 push 到新数组中去 push 的时候做判断 如果新数组中没有这项就 push 用 indexOf(item)=== -1 做判断

```js
function two(params) {
  let newarr = [];
  params.forEach((item) => {
    if (newarr.indexOf(item) === -1) {
      newarr.push(item);
    }
  });
  return newarr;
}
```

- 利用两层 for 循环 第一层直接遍历 第二层从 i+1 开始遍历 就是吧数组中的一项和数组中的每一项做对比 如果有一样的 那么就截取掉

```js
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
```

- 利用 filter 筛选 筛选索引 如果 indexof(item)等于 index 原理是 indexOf 是从前往后找 找到了之后他就不找了 如果这时候做个比较 只有相等的时候满足条件就可以去重了

```js
function four(params) {
  return params.filter((item, index) => {
    return params.indexOf(item) === index;
  });
}
```

- 两层 for 循环 把数组中的一项和数组中的每一项做对比 重复的把 flag 赋值为 2 下面做个判断 当 flag 为 1 的时候才 push

```js
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
```

- 对象数组去重原理第一层直接遍历 第二层从 i+1 开始遍历 就是吧把数组中的一项的 key 和数组中的每一项的 key 做对比 如果有一样的 那么就截取掉这一项

```js
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

也叫伪数组，在 js 中有一些对象它也拥有 length 属性，且拥有为非负整数的属性(索引)，但是它又不能调用数组的方法，这种对象被称为类数组对象

常见的伪数组

- DOM 方法返回的 NodeList（比如 document.querySelectorAll() 的结果）
- arguments 对象

**类数组转换成真正的数组**

1. let 定义一个类数组 把类数组拆分成一系列用逗号隔开的值 arr =[一系列用逗号隔开的值]

2. Array.from()方法用于将对象转为真正的数组(类数组转数组)

3. 遍历类数组 将取到的每一项值添加到新数组

## js 数据类型检测

- typeof 引用数据类型（如：Array）是不起作用的。
- instanceof 检测基本数据类型的话会返回 false 引用数据类型则会是 true 但是用 new 关键字 new 出来的基本数据类型是可以的
- constructor 声明了一个构造函数，并且把他的原型指向了其他类型的原型 这种情况下会失效
- Object.prototype.toString.call() - 最好的数据类/型检测方式

## this 指向哪里

- 普通函数的 this 指向调用这个函数的对象，默认是 window
- 构造函数的 this 指向 new 出来的实例对象，而且优先级是最高的，不能被改变
- 箭头函数的 this 指向的是它外面的第一个不是箭头函数的函数的 this， 在定义时就确定了，不能被改变
- 事件处理函数的 this 指向事件对象

## 如何改变 this 指向

- 利用 call,apply,bind 改变 this 的指向。
- 利用变量将正确的 this 存储为变量。
- new 关键字改变 this 的指向。
- 箭头函数

## call, apply, bind 区别

- call 和 apply 都是为了解决改变 this 的指向。作用都是相同的，只是传参的方式不同。
- 除了第一个参数外，call 可以接收一个参数列表，apply 只接受一个参数数组。
- bind 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 bind 实现柯里化。

## 常用的 git 命令

**git**
git 是目前世界上最先进分布式的版本控制系统

```bash
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

垃圾回收方式

- 标记清除
  工作原理：是当变量进入环境时，将这个变量标记为“进入环境”。当变量离开环境时，则将其标记为“离开环境”。标记“离开环境”的就回收内存。
- 引用计数
  工作原理：跟踪记录每个值被引用的次数。一旦没有引用，内存就直接释放了。
- 内存管理
  什么时候触发垃圾回收？
  垃圾回收器周期性运行，如果分配的内存非常多，那么回收工作也会很艰巨，确定垃圾回收时间间隔就变成了一个值得思考的问题。
  - 合理的 GC 方案：(1)、遍历所有可访问的对象; (2)、回收已不可访问的对象。
  - GC 缺陷： (1)、停止响应其他操作；
  - GC 优化策略： (1)、分代回收（Generation GC）;(2)、增量 GC

## 深浅拷贝

- 浅拷贝,拷贝一级，如果是对象里面还有对象,无法解决
  - for… in… 循环
  - Object.assgin() 缺点：非常消耗性能 比如一个对象中某一个数据改变 会导致整个数据的地址改变 消耗内存 所以有了 immutable
  - ...扩展运算符
- 深拷贝
  - JSON.parse(JSON.stringify( )) 缺点：当对象的 value 是函数 或者 undefined 时会失效
  - 用 for…in…+递归

## 构造函数详解与总结

**什么是构造函数？**

构造函数（Constructor Function）是 JavaScript 中用于创建对象的一种特殊函数。它主要用于在实例化对象时，初始化对象的属性和方法。

- 构造函数通常**首字母大写**，以示区别于普通函数。
- 构造函数需要与 `new` 关键字一起使用。

**构造函数的执行流程**

当使用 `new` 关键字调用构造函数时，执行过程如下：

1. 在内存中创建一个新的空对象。
2. 将构造函数内部的 `this` 指向这个新对象。
3. 执行构造函数内的代码（给新对象添加属性和方法）。
4. 返回新对象（如果构造函数没有显式返回对象，则返回步骤 1 创建的对象）。

**构造函数的示例**

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHello = function () {
    console.log("Hello, I am " + this.name);
  };
}

const p1 = new Person("Alice", 18);
p1.sayHello(); // 输出：Hello, I am Alice
```

**注意事项**

- 构造函数必须和 `new` 一起使用，否则 `this` 指向全局对象（在严格模式下为 undefined）。
- 构造函数可以不用 `return` 返回值；如果返回的是非对象类型，仍然返回新对象本身；如果返回的是对象，则返回该对象。
- 通过构造函数创建的多个对象实例，**各自拥有独立的属性和方法**。

**构造函数和普通函数的区别**

| 区别      | 构造函数                | 普通函数           |
| --------- | ----------------------- | ------------------ |
| 命名      | 通常首字母大写          | 通常首字母小写     |
| 调用方式  | 必须用 `new` 关键字调用 | 直接调用           |
| this 指向 | 指向新创建的对象        | 由调用方式决定     |
| 返回值    | 默认返回新对象          | 默认返回 undefined |

**总结**

- 构造函数本质上就是一个普通函数，但用来创建对象实例。
- 使用 `new` 关键字调用构造函数可以自动完成对象的创建和初始化。
- 合理使用构造函数可以提高代码的复用性和可维护性，是 JS 面向对象编程的基础。

## 原型链

**原型（prototype）的概念**

- **每一个函数都有一个 prototype 属性**

  - 这个属性指向一个对象，称为“原型对象”。
  - 当函数作为构造函数（即用 `new` 创建对象）时，新创建的对象会自动拥有对这个原型对象的引用。

- **原型对象的作用**

  - 所有定义在 prototype 上的属性和方法，都会被该构造函数的实例继承和共享。
  - 适合将不变（公用）的属性和方法定义在 prototype 上，节省内存，提高复用性。

- **this 的指向**

  - 在构造函数内部，`this` 指向实例对象。
  - 在原型对象内部，`this` 也指向调用该方法的实例对象。

- **示例代码**

  ```js
  function Person(name) {
    this.name = name;
  }

  Person.prototype.sayHello = function () {
    console.log("Hello, I am " + this.name);
  };

  const p1 = new Person("Alice");
  p1.sayHello(); // 输出：Hello, I am Alice
  ```

---

**原型链的概念**

- **什么是原型链？**

  - 原型链是 JavaScript 实现继承的主要机制。
  - 每个对象都有一个内部属性 `__proto__`（标准写法为 [[Prototype]]），指向它的原型对象。
  - 多个对象通过 `__proto__` 属性串联在一起，形成链状结构，称为“原型链”。

- **查找规则**

  - 当访问一个对象的属性或方法时，如果对象本身没有，就会去它的原型对象（即 `__proto__` 指向的对象）查找。
  - 如果原型对象也没有，再继续沿着它的 `__proto__` 查找，直到找到 `Object.prototype`，其 `__proto__` 为 `null`，原型链到此结束。

- **原型链结构图**

  ```
  实例对象  ——>  构造函数.prototype  ——>  Object.prototype  ——>  null
      |                |                     |
      |__proto__       |__proto__            |__proto__
  ```

- **示例代码**

  ```js
  function Animal() {}
  Animal.prototype.eat = function () {
    console.log("eating");
  };

  function Dog() {}
  Dog.prototype = new Animal();
  Dog.prototype.bark = function () {
    console.log("bark");
  };

  const dog = new Dog();
  dog.bark(); // bark
  dog.eat(); // eating
  ```

---

**核心要点总结**

- 每个函数都有 prototype 属性，每个对象（除 null）都有 **proto** 属性。
- 构造函数的 prototype 上定义的方法和属性，会被所有实例共享。
- 原型链让对象可以“继承”到上层原型对象的属性和方法。
- 属性/方法的查找顺序：对象本身 → 原型对象 → 原型链上一层... → Object.prototype → null

## js 的几种模块规范

**ES Module（ESM，ES6 模块规范）**

- **应用场景**：现代浏览器和 Node.js（支持 .mjs 或 "type": "module"）。
- **核心思想**：JavaScript 官方标准的模块系统，静态分析，编译时确定依赖关系。
- **特点**：

  - 使用 `export` 导出，`import` 导入。
  - 支持异步和静态引入，最适合前端工程化。
  - 代码示例：

    ```js
    // a.js
    export const foo = "bar";

    // b.js
    import { foo } from "./a.js";
    console.log(foo); // 输出 'bar'
    ```

---

**CommonJS**

- **应用场景**：主要用于 Node.js 服务器端开发。
- **核心思想**：每个文件就是一个模块，模块内部通过 `module.exports` 导出成员，通过 `require` 导入模块。
- **特点**：

  - 同步加载模块（适合服务器，文件都在本地）。
  - 代码示例：

    ```js
    // a.js
    module.exports = {
      foo: "bar",
    };

    // b.js
    const a = require("./a.js");
    console.log(a.foo); // 输出 'bar'
    ```

---

**AMD（Asynchronous Module Definition）**

- **应用场景**：主要用于浏览器端，代表库有 RequireJS。
- **核心思想**：异步加载模块，适合浏览器环境。
- **特点**：

  - 使用 `define` 定义模块，`require` 加载模块。
  - 支持依赖前置，异步加载。
  - 代码示例：

    ```js
    // 定义模块
    define(["dep1", "dep2"], function (dep1, dep2) {
      return {
        foo: function () {},
      };
    });

    // 使用模块
    require(["moduleA"], function (moduleA) {
      moduleA.foo();
    });
    ```

---

**CMD（Common Module Definition）**

- **应用场景**：主要用于浏览器端，代表库有 SeaJS（国内较流行）。
- **核心思想**：按需加载（延迟执行），依赖就近。
- **特点**：
  - 使用 `define` 定义模块，`require` 加载模块。
  - 依赖可以写在使用的地方，延迟执行。
  - 代码示例：
    ```js
    define(function (require, exports, module) {
      var $ = require("jquery");
      exports.foo = function () {};
    });
    ```

---

**总结**

- **ESM**：ES6 官方标准，现代浏览器和 Node.js 推荐使用。
- **CommonJS**：服务端 Node.js 标准，同步加载。
- **AMD/CMD**：浏览器端异步加载，前者依赖前置，后者依赖就近。

### CommonJS 和 ES6 模块的区别

**加载方式**

- **CommonJS**：同步加载模块，适用于服务器端（如 Node.js），因为本地文件读取速度快。
- **ES6 Module**：静态分析，编译时加载，支持异步和静态引入，适合浏览器和现代前端工程

**导入导出语法**

- **CommonJS**

  - 导出：`module.exports = ...` 或 `exports.xxx = ...`
  - 导入：`const xxx = require('...')`

- **ES6 Module**

  - 导出：`export` 或 `export default`
  - 导入：`import { xxx } from '...'` 或 `import xxx from '...'`

**导出本质**

- **CommonJS**：导出的是值的**拷贝**（require 时会执行一遍，被缓存；后续 require 拿到缓存的对象）。
- **ES6 Module**：导出的是**引用**（export 的变量和 import 的变量实时绑定，动态更新）。

**语法特性**

- **CommonJS**

  - 动态语法，可以在运行时任意位置调用 `require`。
  - 导出可以是任意类型的数据（对象、函数、字符串等）。

- **ES6 Module**
  - 静态语法，`import` 和 `export` 必须写在顶层，不能放在逻辑块或函数内部。
  - 支持静态分析和 Tree Shaking（按需打包）。

**执行时机**

- **CommonJS**：模块是**运行时加载**，require 时同步读取、立即执行一遍。
- **ES6 Module**：模块是**编译时解析**，提前确定依赖关系，提升性能。

**总结**

| 对比点   | CommonJS               | ES6 Module     |
| -------- | ---------------------- | -------------- |
| 加载方式 | 同步                   | 静态、异步支持 |
| 导入导出 | require/module.exports | import/export  |
| 导出本质 | 值的拷贝               | 引用绑定       |
| 执行时机 | 运行时                 | 编译时         |
| this     | 指向 exports           | undefined      |
| 兼容性   | Node.js（服务端）      | 浏览器+Node.js |

## 防抖节流

**函数的防抖（Debounce）**

- **定义**：当事件被触发后，等待一段指定时间再执行回调。如果在等待时间内事件再次被触发，则重新计时，只有最后一次触发后等待时间到了才执行。
- **应用场景**：输入框实时搜索、窗口大小变化、滚动加载等频繁触发场景，减少无效调用。

- **实现示例**：

  ```js
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  // 使用方式
  window.addEventListener(
    "resize",
    debounce(function () {
      console.log("窗口大小变化");
    }, 500)
  );
  ```

**函数节流（Throttle）**

- **定义**：在指定的时间间隔内，不管事件被触发多少次，只会执行一次回调函数。
- **应用场景**：页面滚动、按钮点击、窗口缩放等高频事件，控制函数的执行频率，提升性能。

- **实现示例**：

  ```js
  function throttle(fn, interval) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime > interval) {
        fn.apply(this, args);
        lastTime = now;
      }
    };
  }

  // 使用方式
  window.addEventListener(
    "scroll",
    throttle(function () {
      console.log("页面滚动");
    }, 200)
  );
  ```

## js 实现继承的方式有哪些

- 构造函数继承 核心：使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类（没用到原型）
- 原型链继承-----核心： 将父类的实例作为子类的原型\*\*
- 组合（混合）继承----核心：通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
- class 继承----核心：class 是 ES6 新增的语法 直接 class 创建一个类，使用 extends 来继承
- 实例继承----核心：为父类实例添加新特性，作为子类实例返回
- 拷贝继承-----核心：Object.assign()用于对象的合并，将源对象的所有可枚举属性，复制到目标对象。
- 寄生组合继承----核心：通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点

## 严格模式下有哪些限制（规则）

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用 with 语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量 delete prop，会报错，只能删除属性 delete global[prop]
- eval 不会在它的外层作用域引入变量
- eval 和 arguments 不能被重新赋值
- arguments 不会自动反映函数参数的变化
- 不能使用 arguments.callee
- 不能使用 arguments.caller
- 禁止 this 指向全局对象
- 不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈
- 增加了保留字（比如 protected、static 和 interface）

## 函数缓存的方法

**基本思想**

- 当函数被调用时，先检查传入的参数是否有对应的结果已被缓存。
- 如果有，直接返回缓存的结果。
- 如果没有，执行计算，把结果缓存起来，下次遇到相同参数直接取用。

**常见实现方式**

- 闭包实现

  ```js
  function memoize(fn) {
    const cache = {};
    return function (...args) {
      const key = JSON.stringify(args);
      if (cache[key]) {
        return cache[key];
      }
      const result = fn.apply(this, args);
      cache[key] = result;
      return result;
    };
  }

  // 示例：斐波那契数列
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const memoFibonacci = memoize(fibonacci);
  console.log(memoFibonacci(40)); // 比直接递归快得多
  ```

**Map 实现（更适合复杂参数）**

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

**应用场景**

- 递归函数（如斐波那契数列、阶乘等）
- 重复计算但参数不变的复杂运算
- 前端数据转换、过滤等纯函数操作

**注意事项**

- 适用于“纯函数”（相同参数总是返回相同结果，无副作用）
- 参数复杂时需要设计好缓存 key，避免缓存污染或内存泄漏
- 不适合缓存大量或不断变化的数据

**相关扩展**

- Lodash 等第三方库提供了 `_.memoize` 方法
- ES6 WeakMap 可用于缓存对象参数，避免内存泄漏

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
