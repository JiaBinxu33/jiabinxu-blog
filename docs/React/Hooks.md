# hocks

## 简介

从 react 中解构出以 use 开头的函数 让函数式组件拥有类组件的功能

## useState

useState 是一个 React 钩子，可让你将 状态变量 添加到组件中。

```jsx
const [state, setState] = useState(initialState);
```

- [参考](#参考)
  - [useState (initialState)](<#useState(initialState)>)
  - [set 函数与 setSomething(nextState) 类似](<#set函数与setSomething(nextState)类似>)
- 用法
  - [向组件添加状态](#向组件添加状态)
  - [根据之前的状态更新状态](#根据之前的状态更新状态)
  - [更新状态中的对象和数组](#更新状态中的对象和数组)
  - [避免重新创建初始状态](#避免重新创建初始状态)
  - [使用键来重置状态](#使用键来重置状态)
  - [存储以前渲染的信息](#存储以前渲染的信息)
- [故障排除](#故障排除)
  - [我更新了状态，但日志记录给了我旧值](#我更新了状态，但日志记录给了我旧值)
  - [我已经更新了状态，但是屏幕没有更新](#我已经更新了状态，但是屏幕没有更新)
  - [我收到错误：“太多的重新渲染”](#我收到错误：“太多的重新渲染”)
  - [我的初始化或更新函数运行两次](#我的初始化或更新函数运行两次)
  - [我正在尝试将状态设置为一个函数，但它被调用了](#我正在尝试将状态设置为一个函数，但它被调用了)

### 参考

#### useState (initialState)

useState(initialState)
在组件的顶层调用 useState 以声明 状态变量。

```jsx
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

约定是使用 数组解构 命名状态变量，例如 [something, setSomething]。

- 参数
  initialState：你希望状态的初始值。它可以是任何类型的值，但函数有特殊的行为。这个参数在初始渲染后被忽略。

如果你将函数作为 initialState 传递，它将被视为初始化函数。它应该是纯粹的，不带任何参数，并且应该返回任何类型的值。React 在初始化组件时会调用你的初始化函数，并将其返回值存储为初始状态。请参见下面的示例。

- 返回
  Returns

useState 返回一个恰好包含两个值的数组：

当前状态。在第一次渲染期间，它将与你传递的 initialState 相匹配。

set 函数 允许你将状态更新为不同的值并触发重新渲染。

- 注意事项
  useState 是一个 Hook，所以你只能在你的组件的顶层或者你自己的钩子中调用它。你不能在循环或条件内调用它。如果需要，提取一个新组件并将状态移入其中。

在严格模式下，React 将调用你的初始化函数两次，以便 帮助你发现意外杂质 这是仅开发行为，不会影响生产。如果你的初始化函数是纯函数（它应该是纯函数），这应该不会影响行为。其中一个调用的结果将被忽略。

#### set 函数与 setSomething(nextState) 类似

useState 返回的 set 函数允许你将状态更新为不同的值并触发重新渲染。你可以直接传递下一个状态，或从前一个状态计算它的函数：

```jsx
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

- 参数
  nextState：你希望状态成为的值。它可以是任何类型的值，但函数有特殊的行为。

如果你将函数作为 nextState 传递，它将被视为更新函数。它必须是纯粹的，应该将挂起状态作为其唯一参数，并且应该返回下一个状态。React 会将你的更新程序函数放入队列中并重新渲染你的组件。在下一次渲染期间，React 将通过将所有排队的更新器应用于前一个状态来计算下一个状态。请参见下面的示例。

- 返回
  set 函数没有返回值。

- 注意事项

set 函数仅更新下一次渲染的状态变量。如果你在调用 set 函数后读取状态变量，则 你仍然会得到旧的值 在你调用之前显示在屏幕上。

如果你提供的新值与当前的 state 相同（通过 Object.is 比较确定），React 将跳过重新渲染组件及其子组件。这是一个优化。尽管在某些情况下 React 可能仍需要在跳过子级之前调用你的组件，但这不应该影响你的代码。

React 批量状态更新。 在所有事件处理程序运行并调用其 set 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在极少数情况下，你需要强制 React 提前更新屏幕，例如访问 DOM，你可以使用 flushSync。

set 函数具有稳定的标识，因此你经常会看到它从副作用依赖中省略，但包含它不会导致副作用触发。如果 linter 允许你在没有错误的情况下省略依赖，那么这样做是安全的。详细了解如何删除副作用依赖。

在渲染期间调用 set 函数只能从当前渲染组件中调用。React 将丢弃其输出并立即尝试使用新状态再次渲染它。这种模式很少需要，但你可以使用它来存储先前渲染的信息。请参见下面的示例。

在严格模式下，React 将调用你的更新程序函数两次，以便 帮助你发现意外杂质 这是仅开发行为，不会影响生产。如果你的更新程序函数是纯函数（它应该是纯函数），这应该不会影响行为。其中一个调用的结果将被忽略。

## useEffect

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
