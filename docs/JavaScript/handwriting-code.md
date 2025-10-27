# 常见面试题

## 基础算法

### 算法实现对象中 url 拼接成数组

```JavaScript
const sidebarMenus = [
  {
    url: "",
    children: [
      {
        url: "/app",
        children: [
          {
            url: "/:id/info",
            children: [],
          },
          {
            url: "/:id/detail",
            children: [
              {
                url: "/group",
              },
            ],
          },
        ],
      },
    ],
  },
];

['', '/app', '/app/:id/info', '/app/:id/detail', '/app/:id/detail/group'];
function fn(arr, currentPath = "") {
  let result = [];
  arr.forEach((element) => {
    const newPath = currentPath + element.url; // 当前节点的新路径
    result.push(newPath); // 无论是否有子节点，都记录当前路径

    // 递归处理子节点，并合并结果(注意：element.children最后一个children中并没有children属性，需要判断是否存在children属性)
    if (element.children && element.children.length > 0) {
      result = result.concat(fn(element.children, newPath));
    }
  });
  return result;
}
```

### 过滤出对象数组中符合条件的数组

- 年龄大于等于 18 岁的用户
- 将用户姓名转换为大写
- 按照年龄升序排序
- 返回处理后的新数组

```JavaScript
  const users = [
    { name: "alice", age: 22 },
    { name: "bob", age: 17 },
    { name: "charlie", age: 19 },
    { name: "david", age: 15 },
  ];
  function fn(users) {
    let result
    result = users.filter(item => {
      return item.age >= 18;
    }).map(item =>{
      return {...item,name:item.name.toUpperCase()}
    }).sort((a,b)=>{
      return a.age - b.age;
    })
    return result;
  }
```

## 常见函数原理

### call()函数的实现

第一个参数为 null 或者 undefined 时，this 指向全局对象 window，值为原始值的指向该原始值的自动包装对象，如 String、Number、Boolean
为了避免函数名与上下文(context)的属性发生冲突，使用 Symbol 类型作为唯一值
将函数作为传入的上下文(context)属性执行
函数执行完成后删除该属性
返回执行结果

call 函数实例：

```JavaScript
var obj = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(obj); // 1
```

- 模拟实现该效果
  试想当调用 call 的时候，把 obj 对象改造成如下：

```JavaScript
    var obj = {
        value: 1,
        bar: function() {
            console.log(this.value)
        }
    };

    obj.bar(); // 1
```

这个时候 this 就指向了 obj,但是也为 obj 添加了一个多余的属性，所以需要删除多余的属性

```JavaScript
// 第一步
obj.fn = bar
// 第二步
obj.fn()
// 第三步
delete obj.fn
```

myCall 函数中的 this 指向 fn，所以把 obj.fn = this（myCall 中的 this）

- 注意
  return，函数可以有返回值
  判断传入参数 context
  可能存在多个参数，解构多个参数

```JavaScript
Function.prototype.myCall = function(context,...args){
    let cxt = context || window;
    //将当前被调用的方法定义在cxt.func上.(为了能以对象调用形式绑定this)
    //新建一个唯一的Symbol变量避免重复
    let func = Symbol()
    cxt[func] = this;
    args = args ? args : []
    //以对象调用形式调用func,此时this指向cxt 也就是传入的需要绑定的this指向
    const res = args.length > 0 ? cxt[func](...args) : cxt[func]();
    //删除该方法，不然会对传入对象造成污染（添加该方法）
    delete cxt[func];
    return res;
}
```

### 实现 PromisealSettled()方法

- 说明：PromisealSettled() 方法返回一个 Promise，该 Promise 在所有给定的 Promise 都已经成功解决(fulfilled) 或拒绝(rejected)之后解决，并返回一个对象数组，每个对象都描述了每个 Promise 的结果。与 Promise 不同的是, Promise.all 一旦遇到错误就会立即拒绝，而 PromisealSettled 则会等待所有 Promise 都结束(无论成功还是失败)

```JavaScript

```

### 实现一个简单的Promise
思考:首先要手写一个promise就需要思考原生的promise执行的过程是什么样的？
-  Promise 三个状态，pending ，fulfilled(resolve)，reject
  只能从pending>fulfilled
  只能从pending>reject
  并且状态一单改变就会凝固不能再被改变
我们先来看看原生promise的使用
```JavaScript
let p = new Promise((resolve,reject)=>{
  resolve(result)
})
p.then((result)=>{
  console.log("result")
})
```
- 在promise类中 我们可以看到，他接受一个参数，在promiseA+范式中 我们把它称作executor(执行器),executor的执行是同步的，
我们还需要准备resolve和reject方法，以及他的三个状态，并添加判断只有是pending状态的时候才可以去改变状态
创建出执行队列以便异步操作使用
注意：这里使用#state,# 的作用的是防止从外部直接修改类内部的状态
```JavaScript
// Promise 的三种状态常量
const PENDING = 'pending';    // 等待状态
const FULFILLED = 'fulfilled'; // 成功状态
const REJECTED = 'rejected';   // 失败状态

class MyPromise {
  // 私有属性，使用 # 前缀表示
  #state = PENDING;     // 当前状态，初始为 pending
  #value = undefined;   // 成功时保存的值
  #reason = undefined;  // 失败时保存的原因

  /**
   * 构造函数
   * @param {Function} executor 执行器函数，接收 resolve 和 reject 两个参数
   */
  constructor(executor) {
    // 定义 resolve 函数
    const resolve = (value) => {
      // 只有 pending 状态可以转换
      if (this.#state === PENDING) {
        this.#state = FULFILLED; // 转换状态
        this.#value = value;     // 保存值
        
        // 执行所有成功回调
        this.#onFulfilledCallbacks.forEach(cb => cb());
        this.#onFulfilledCallbacks = []; // 清空队列
      }
    };

    // 定义 reject 函数
    const reject = (reason) => {
      // 只有 pending 状态可以转换
      if (this.#state === PENDING) {
        this.#state = REJECTED; // 转换状态
        this.#reason = reason;  // 保存原因
        
        // 执行所有失败回调
        this.#onRejectedCallbacks.forEach(cb => cb());
        this.#onRejectedCallbacks = []; // 清空队列
      }
    };

    try {
      // 立即执行 executor
      executor(resolve, reject);
    } catch (error) {
      // 如果执行器抛出异常，直接 reject
      reject(error);
    }
  }
}
```
此时实现了最基本的 Promise 骨架，但缺少：
- then 方法实现
- 链式调用支持
- 异步处理能力
我们来一个一个解决他们，首先我们来为类添加一个then方法
在我们使用的时候可能只会使用到他的第一个参数，也就是获取成功的结果，
但是其实在A+范式中他是有两个参数onFulfilled, onRejected
```JavaScript
class MyPromise {
  #state = PENDING;  // 私有状态字段
  #value = null;     // 成功值
  #reason = null;    // 失败原因
  
  constructor(executor) {
    const resolve = (value) => {
      if (this.#state === PENDING) {
        this.#state = FULFILLED;
        this.#value = value;
      }
    };
    
    const reject = (reason) => {
      if (this.#state === PENDING) {
        this.#state = REJECTED;
        this.#reason = reason;
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    // 参数校验
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    if (this.#state === FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.#value);
      });
    } else if (this.#state === REJECTED) {
      setTimeout(() => {
        onRejected(this.#reason);
      });
    }
  }
}
```
异步的处理
异步处理的核心：添加成功/失败队列，当触发then/catch(目前还没有添加catch方法)的时候
先把要执行的onFulfilled, onRejected函数添加到队列当中，只有触发了resolve方法在取出存储的方法并执行
```JavaScript
then(onFulfilled, onRejected) {
  // ...参数校验同上...

  // 添加回调队列
  if (this.#state === PENDING) {
    this.#onFulfilledCallbacks.push(() => {
      setTimeout(() => {
        onFulfilled(this.#value);
      });
    });
    
    this.#onRejectedCallbacks.push(() => {
      setTimeout(() => {
        onRejected(this.#reason);
      });
    });
  }
}
```
现在我们为类添加了一个基础的then，我们又会发现新的问题
没有返回新的 Promise，无法链式调用
解决：链式调用的核心处理思想就是return一个新的promise


```JavaScript
then(onFulfilled, onRejected) {
  // ...参数校验同上...

  // 返回新的 Promise 以实现链式调用
  const promise2 = new newPromise((resolve,reject)=>{ //链式调用的核心，promise.then需要返回一个新的promise，才能链式接着.
        if (this.#state === FULFILLED) {
          setTimeout(()=>{ // 注意：这里的代码需要是异步的因为如果deepPromise中的代码是同步的 resolvePromise中需要传deepPromise，还没有生成完就传会报错
            let result = onFulfilled(this.#value); // 这里获取到当前.then回调的返回值
            resolvePromise(result,resolve,reject,deepPromise); // 执行下一次的resolve,并且判断可能return promise的情况 如果是promise 需要把值传递给promise
          })
        }
        if (this.#state === REJECT) {
          let rej = onRejected(this.#value);
          reject(rej);
        }
        if(this.#state === PENDING){//异步的核心代码，当触发then方法的时候把执行函数放在队列中，触发了resolve/reject的时候再去执行
          this.#onResolveCallbacks.push(()=>{
            onFulfilled(this.#value);
          })
          this.#onRejectedCallbacks.push(()=>{
            onRejected(this.#value);
          })

        }
      })

  return promise2;
}
```
这个时候，我们需要去解析判断一下传进来的x，而不是直接传进去，他有可能是promise对象，我们来添加一个解析promise的函数
```JavaScript
 /**
 * 用于判断return类型是promise还是普通值
 * @param result 判断的对象
 * @param resolve result为promise的情况要执行的resolve
 * @param reject result为promise的情况要执行的reject
 * @param deepPromise 用来解决return自己的错误
 * @return {number} 数组的总和
 */
 function resolvePromise(result,resolve,reject,deepPromise){
  if(result === deepPromise){
    reject(new TypeError(`Uncaught TypeError TypeError: Chaining cycle detected for promise #<Promise>
    --- Promise.then ---`))
  // }
  if(result instanceof newPromise){
    // 简写(value=>resolve(value), err => reject(err)) 等同于(resolve,reject)
    // result.then(value=>resolve(value), err => reject(err))
    result.then(resolve,reject);
  } else{
    resolve(result)
  }
 }
}
```
判断过后我们来整合一下现在的then方法
```JavaScript
    then = function (onFulfilled, onRejected) {
        // 参数校验
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

      let deepPromise = new newPromise((resolve,reject)=>{ //链式调用的核心，promise.then需要返回一个新的promise，才能链式接着.
        if (this.#state === FULFILLED) {
          setTimeout(()=>{ // 注意：这里的代码需要是异步的因为如果deepPromise中的代码是同步的 resolvePromise中需要传deepPromise，还没有生成完就传会报错
            let result = onFulfilled(this.#value); // 这里获取到当前.then回调的返回值
            resolvePromise(result,resolve,reject,deepPromise); // 执行下一次的resolve,并且判断可能return promise的情况 如果是promise 需要把值传递给promise
          })
        }
        if (this.#state === REJECT) {
          let rej = onRejected(this.#value);
          reject(rej);
        }
        if(this.#state === PENDING){//异步的核心代码，当触发then方法的时候把执行函数放在队列中，触发了resolve/reject的时候再去执行
          this.#onResolveCallbacks.push(()=>{
            onFulfilled(this.#value);
          })
          this.#onRejectedCallbacks.push(()=>{
            onRejected(this.#value);
          })

        }
      })
      return deepPromise;
    };
```
到这里就实现了一个简单的promise，其中还缺乏了很多校验和静态方法，只作为理解promise使用。

## leetCode 系列

### 无重复字符的最长子串(力扣华为面试题库-中等难度)

- 示例 1:

输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

- 示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

- 示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

1. 题解 1：暴力解法 双重 for 循环双指针移动，存储结果找到最长字串（O(n²)复杂度）

```JavaScript

var lengthOfLongestSubstring = function (s) {
    if(s.length === 1)return 1;
    let str = "";
    const len = s.length;
    for (let i = 0; i < s.length; i++) {
      let currentStr = s[i];
      for (let j = i + 1; j < len; j++) {
        if (currentStr.indexOf(s[j]) !== -1) {
          break;
        } else {
          currentStr += s[j];
        }
      }
      if (currentStr.length > str.length) str = currentStr;
    }
    return str.length;
};
```

2. 题解 2：使用滑块思想，移动滑块存储当前最长字符串（O(n²)复杂度）

```JavaScript

var lengthOfLongestSubstring = function (s) {
  let str = "";
    let len = s.length;
    if (len === 1) return 1;
    for (let i = 0; i < len; i++) {
      let currentStr = s[i];
      let j = i + 1;
      while (currentStr.indexOf(s[j]) == -1) {
        currentStr += s[j];
        j++;
        // 处理越界
        if (j >= len) {
          j = len - 1;
        }
      }

      if (currentStr.length > str.length) str = currentStr;
      // 如果j走到头了就不用判断了
      if (j === len - 1) {
        break;
      }
      i = s.indexOf(s[j], i);
    }
    return str.length;
};
```

3. 题解 3：使用滑块思想+Set 结构去除重复值（O(n)复杂度）

```JavaScript
var lengthOfLongestSubstring = function (s) {
    let seen = new Set(); // 存储当前窗口的字符
    let left = 0,
      maxLen = 0;
    for (let right = 0; right < s.length; right++) {
      while (seen.has(s[right])) {
        seen.delete(s[left]);
        left++;
      }
      seen.add(s[right]);
      maxLen = maxLen > seen.size ? maxLen : seen.size;
    }
    return maxLen;
};
```
