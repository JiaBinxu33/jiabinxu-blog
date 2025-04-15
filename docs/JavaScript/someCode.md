```JavaScript
  //自己写的简单的Promise，还没写完，里面还没写catch，正常异步能实现，但是不能链式+异步写到了resolvePromise，
  let FULFILLED = "fulfilled";
  let REJECT = "reject";
  let PENDING = "pending";

  class newPromise {
    #state = PENDING; // #  防止promise内部状态被外部修改
    #value = null; // 用于记录获取到的数据
    #reason = null; // 记录失败的原因
    #onResolveCallbacks = [];
    #onRejectedCallbacks = [];
    constructor(exectuor) {
      // exectuor promiseA+范式规范标准规定名称
      const resolve = (value) => {
        if (this.#state === PENDING) {
          // 防止状态被修改
          this.#state = FULFILLED;
          this.#value = value;
          this.#onResolveCallbacks.forEach(fn => fn());//异步的核心代码，当执行resolve的时候去执行成功队列
          this.#onResolveCallbacks = []; // 清空队列
        }
      };
      const reject = (reason) => {
        if (this.#state === PENDING) {
          // 防止状态被修改
          this.#state = REJECT;
          this.#reason = reason;
          this.#onRejectedCallbacks.forEach(fn => fn());
          this.#onRejectedCallbacks = []; // 清空队列
        }
        throw Error("Error:" + reason);
      };
      try {
        exectuor(resolve, reject);
      } catch (err) {
        reject(err);
      }
    }
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
  }
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