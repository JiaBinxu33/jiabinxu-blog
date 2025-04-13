# hocks

## 简介

从 react 中解构出以 use 开头的函数 让函数式组件拥有类组件的功能

## useState - 让函数式组件拥有自己的状态

useState 传入的参数就是状态中的数据 一个组件可以有多个 useState
useState 的调用的结果是一个数组 useState 有两个参数 第一个参数是数据的默认值 第二个参数是改变这个状态的方法
从 useState 中可以解构出两个参数 state 和 setState 并且 state 的值能能通过 setState 去改变
第二个参数的写法和函数式组件中的 setState 一样
_写法_
let [state, setState] = useState(4);
setState((state) => {
return state - 1;
});
···
setState 是同步的还是异步的？
在合成事件里面是异步的
在生命周期里面是异步的
在定时器里面是同步的
在原生 js 事件里面是同步的
···

## useEffect - useEffect 是用来代替生命周期的

一般这样写
const [count, setCount] = useState(10);
useEffect 的第一个参数是一个函数
第二个参数是一个数组（依赖）

1.  如果只有一个参数的时候，相当于是 componentDidMount, componentDidUpdate 直接执行
2.  如果第二个参数是一个空数组，相当于 componentDidMount 刚开始执行一次 之后就不会在执行了
3.  如果不是空数组，相当于 componentDidMount 和 watch 依赖的值改变了里面就执行
4.  里面 return 一个函数，相当于 componentWillUnmount return 一个函数 在里面做清除定时器 卸载插件等操作
    *如果在 useEffect 里面写封装好的数据请求 *会报警告 但是不会报错 说让数据请求写在 useEffect 里面
    这是因为请求数据的时候 return 一个 fetch 如果 useEffect 里面 return 一个结果 那就相当于第 4 条变成 componentWillUnmount 了
    解决办法： 第一参数里面写一个自执行函数 函数自执行了就没有 return 了
    useEffect(() => {
    (async () => {
    const res = await getData();
    console.log(res);
    })();
    }, []);

## useLayoutEffect 和 useEffect 类似 大部分情况下 使用 useEffect

区别：
简单来说就是调用时机不同，`useLayoutEffect`和原来`componentDidMount`&`componentDidUpdate`一致，在 react 完成 DOM 更新后马上**同步**调用的代码，会阻塞页面渲染。而`useEffect`是会在整个页面渲染完才会调用的代码
什么时候会用到呢 当你需要用 useEffect 去操作 dom 元素的时候 比如 useEfftct 让一个盒子在零秒内向右平移 100px 会出现闪屏 这时候就需要用到 useLayoutEffect

## useMemo - 类似于 vue 中的计算属性

当函数式组件中的一个数据改变的时候 整个函数式组件都会重新渲染 如果不想让其他的函数也跟着重新渲染 这时候就需要给他加 useMemo 缓存起来 useMemo 类似于 vue 中的计算属性
区别
useCallback 缓存的是函数本身
useMemo 缓存的是函数的返回值
useMemo 和 useCallback 也是可以互相改写的 利用上面的特性和函数柯理化

## useCallback

是用来缓存函数的
当组件的数据改变的时候 默认是会全部重新渲染的 因为生命周期数据更新之后会重新 render
想让类组件里面的数据改变 并且引入的子组件不重新渲染 用 PureComponent 比较前后两次是否有变化 由于里面是对象 所以地址不同 所以把对象提出去定义成一个常量就好了
想让函数式组件里面的数据改变 并且引入的子组件不重新渲染 需要引入 memo memo 是一个高阶组件 给子组件套上 相当于类组件中的 PureComponent 然后把对象提到外面写 但是 如果函数式组件有一个自定义事件传参 需要用到函数里面的 state 就不能提到外面去写又由于函数式组件本身就相当于一个 render 他会把里面的所有东西从上往下执行 memo 将新的组件和旧的组件做对比的时候 这时候所产生的函数就又不是同一个函数了 地址不同 这时候就要用到 useCallback 来缓存函数
第一个参数是要缓存的函数，第二个参数是依赖- _只要函数式组件做自定义事件传参就要写_
当一个事件要作为属性传递的时候使用它
写法 ：

```jsx
import React, { useState, memo, useCallback } from "react";
// const fn2 = () => {
// console.log("fn2");
// };
const Child = memo(() => {
console.log("Child");
return (
<>
<span> Child</span>
</>
);
});
const obj = { fontSize: 14 };
const App = () => {
let [count, setCount] = useState(1);
const fn = () => {
setCount((count) => {
return (count = count + 1);
});
};
const fn2 = useCallback(() => {
console.log(123);
}, []);
return (
<>

<div>
<Child style={obj} doSomething={fn2} />
<div>{count}</div>
<button onClick={fn}>btn</button>
{/_ <button onClick={fn2}>btn</button> _/}
</div>

</>
);
};
```

## 浅谈 useMemo 与 useCallback

简单的说

都是用来监听数据变化 来进行控制渲染、减少不必要的渲染 、优化性能
usecallback()是用来监听数据变化从而调用方法
usememo()是用来监听数据变化从而改变数据 使用 return 返回变化的数据 当然 return 也可以返回方法 所以 usememo()可以代替 usecallback()

下面详解

useCallback：缓存回调函数
在 React 函数组件中，每一次 UI 的变化，都是通过重新执行整个函数来完成的，这和传统的 Class 组件有很大区别：函数组件中并没有一个直接的方式在多次渲染之间维持一个状态。 比如下面的代码中，我们在加号按钮上定义了一个事件处理函数，用来让计数器加 1。但是因为定义是在函数组件内部，因此在多次渲染之间，是无法重用 handleIncrement 这个函数的，而是每次都需要创建一个新的：

```JavaScript
function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => setCount(count + 1);
  // ...
  return <button onClick={handleIncrement}>+</button>
}
```

你不妨思考下这个过程。每次组件状态发生变化的时候，函数组件实际上都会重新执行一遍。在每次执行的时候，实际上都会创建一个新的事件处理函数 handleIncrement。
这个事件处理函数中呢，包含了 count 这个变量的闭包，以确保每次能够得到正确的结果。 这也意味着，即使 count 没有发生变化，但是函数组件因为其它状态发生变化而重新渲染时，这种写法也会每次创建一个新的函数。
创建一个新的事件处理函数，虽然不影响结果的正确性，但其实是没必要的。因为这样做不仅增加了系统的开销，更重要的是：每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染。
比如这个例子中的 button 组件，接收了 handleIncrement ，并作为一个属性。如果每次都是一个新的，那么这个 React 就会认为这个组件的 props 发生了变化，从而必须重新渲染。因此，我们需要做到的是：**只有当 count 发生变化时，我们才需要重新定一个回调函数。**而这正是 useCallback 这个 Hook 的作用。

```JavaScript
import React, { useState, useCallback } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = useCallback(
    () => setCount(count + 1),
    [count], // 只有当 count 发生变化时，才会重新创建回调函数
  );
  // ...
  return <button onClick={handleIncrement}>+</button>
}
```

在这里，我们把 count 这个 state ，作为一个依赖传递给 useCallback。这样，只有 count 发生变化的时候，才需要重新创建一个回调函数，这样就保证了组件不会创建重复的回调函数。而接收这个回调函数作为属性的组件，也不会频繁地需要重新渲染。

useMemo：缓存计算的结果
如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算。
举个例子，对于一个显示用户信息的列表，现在需要对用户名进行搜索，且 UI 上需要根据搜索关键字显示过滤后的用户，那么这样一个功能需要有两个状态： 1.用户列表数据本身：来自某个请求。 2.搜索关键字：用户在搜索框输入的数据。
无论是两个数据中的哪一个发生变化，都需要过滤用户列表以获得需要展示的数据。那么如果不使用 useMemo 的话，就需要用这样的代码实现：

```JavaScript
import React, { useState, useEffect } from "react";

export default function SearchUserList() {
  const [users, setUsers] = useState(null);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const doFetch = async () => {
      // 组件首次加载时发请求获取用户数据
      const res = await fetch("https://reqres.in/api/users/");
      setUsers(await res.json());
    };
    doFetch();
  }, []);
  let usersToShow = null;

  if (users) {
    // 无论组件为何刷新，这里一定会对数组做一次过滤的操作
    usersToShow = users.data.filter((user) =>
      user.first_name.includes(searchKey),
    );
  }

  return (
    <div>
      <input
        type="text"
        value={searchKey}
        onChange={(evt) => setSearchKey(evt.target.value)}
      />
      <ul>
        {usersToShow &&
          usersToShow.length > 0 &&
          usersToShow.map((user) => {
            return <li key={user.id}>{user.first_name}</li>;
          })}
      </ul>
    </div>
  );
}

```

在这个例子中，无论组件为何要进行一次重新渲染，实际上都需要进行一次过滤的操作。但其实你只需要在 users 或者 searchKey 这两个状态中的某一个发生变化时，重新计算获得需要展示的数据就行了。那么，这个时候，我们就可以用 useMemo 这个 Hook 来实现这个逻辑，缓存计算的结果

```JavaScript
const usersToShow = useMemo(() => {
    if (!users) return null;
    return users.data.filter((user) => {
      return user.first_name.includes(searchKey));
    }
  }, [users, searchKey]);
```

可以看到，通过 useMemo 这个 Hook，可以避免在用到的数据没发生变化时进行的重复计算。虽然例子展示的是一个很简单的场景，但如果是一个复杂的计算，那么对于提升性能会有很大的帮助。
这也是 userMemo 的一大好处：避免重复计算。 除了避免重复计算之外，useMemo 还有一个很重要的好处：避免子组件的重复渲染。比如在例子中的 usersToShow 这个变量，如果每次都需要重新计算来得到，那么对于 UserList 这个组件而言，就会每次都需要刷新，因为它将 usersToShow 作为了一个属性。而一旦能够缓存上次的结果，就和 useCallback 的场景一样，可以避免很多不必要的组件刷新。

这个时候，如果我们结合 useMemo 和 useCallback 这两个 Hooks 一起看，会发现一个有趣的特性，那就是 useCallback 的功能其实是可以用 useMemo 来实现的。比如下面的代码就是利用 useMemo 实现了 useCallback 的功能：

```JavaScript
 const myEventHandler = useMemo(() => {
   // 返回一个函数作为缓存结果
   return () => {
     // 在这里进行事件处理
   }
 }, [dep1, dep2]);
```

从本质上来说，useMemo 和 useCallback 只是做了同一件事情：建立了一个绑定某个结果到依赖数据的关系。只有当依赖变了，这个结果才需要被重新得到。

## useContext - 用于优化 Context 中 Consumer 的写法

用于优化 Context 中 Consumer 的写法 Provider 还是要正常写
这个 hocks 就是可以传入 createContext 的实例 直接获取到结果
写法：
const { Provider 中的 value } = useContext(context2);

## useReducer - 用于创建一个小型的仓库

reducer 函数的写法和 redux 一样 defaultState 也一样 state 不用写等于 defaultState 调用的时候引入 useuseReducer 有两个参数
第一个参数就是 reducer 函数 第二个是 defaultState 从 useReducer 中解构出 state 和 dispatch 调用就调用 state.count dispatch 中传入 type
const [state, dispatch] = useReducer(reducer, defaultState);
useReducer 里面没有中间键 不能写异步操作 如果要写异步可以写 useEffect 先请求数据 在吧请求到的数据放到仓库里面

## useRef - 类似于 createRef 用于获取 Dom 节点 用 ref 绑定一点就可以了 在父组件的子组件标签上添加一个 ref 属性等于 useRef 的实例

在父组件就可以使用这个 useRef 的实例 函数组件不能绑定 ref？
useRef 还有一些其他的特性 可以绕过 CaptureValue 的特征

利用 useRef 定义的数据 拿到的都只有一个最终状态，而不会在每个 Render 间存在隔离。比如你设置一个定时器 然后当定时器没完成的时候去改变他的值 在变回去 他拿到的还是一个最终状态 但是这个 useRef 不是很好用 没有响应式

## useImperativeHandle 通过 useImperativeHandle 用于让父组件获取子组件内的索引 通过父组件让子组件获得焦点

通过父组件让子组件获得焦点原理
在父组件里面定义一个 ref 等于 useRef 的返回值 在子组件标签中写 ref= {ref} ，让子组件套上一个 forwardRef 高阶组件然后子组件自己也去定义一个 ref 和父组件的名称一样 给子组件中的元素也加上这个 ref 属性 然后在子组件中使用 useImperativeHandle 函数组件可以接受第二个参数 ref useImperativeHandle 的第一个参数是 ref 第二个参数是 input 标签中的那个 ref 的 current 去改变 ref 的指向 让父组件的子组件标签中的 ref 去指向 input 的 ref

# redux 提供的两个 hocks

## useSelect 用于获取仓库数据的

    用于获取仓库数据的
    useSelect 接收一个函数作为参数
    写法：
    const list = useSelector((state) => state.list);

## useDispatch 用于调用 reducer 函数

    useDispatch 用于调用 reducer 函数
    传入一个参数是对象 相当于 action

## useHistory 用于做页面跳转

    useHistory 用于做页面跳转 useHistory 的实例对象下面有 push go 等方法可以进行路由跳转

## useLocation 是用来获取路由信息下的 location 对象

    是用来获取路由信息下的 location 对象 也可以用来做跳转

## 自定义 hocks 相当于 vue 中的组合 API 相同的功能放在一个文件里面
