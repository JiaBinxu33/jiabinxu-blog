# React 基础部分

## react 的特征

react 概念：用于构建用户界面的 JavaScript 库，提供了 UI 层面的解决方案

react 有几个特征：虚拟 dom 树，jsx 语法，组件化，单向数据流

- jsx：语法
  - 只能有一个根节点；但是可以相互嵌套
  - 换行或者多标签最好加括号,防止 js 自动分号不往后执行；
- 虚拟 dom：
  - 虚拟 DOM 是在 DOM 的基础上建立了一个抽象层，对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟 DOM，最后再批量同步到 DOM 中。
  - 在 React 中，render 执行的结果得到的并不是真正的 DOM 节点，而仅仅是 JavaScript 对象，称之为虚拟 DOM。
- 组件化：
  - 每一个 React 文件都是一个组件，含视图、逻辑操作、数据
  - 组件可以被嵌套到其他组件之中
  - 注意组件声明需要首字母大写，如`<TodoList />`
- 单向数据流
  - 子组件对于父组件传递过来的数据是【只读】的
  - 子组件不可直接修改父组件中的数据，只能通过调用父组件传递过来的方法，来间接修改父组件的数据，形成了单向清晰的数据流
- 声明式编程
  - 声明式编程表明想要实现什么目的，应该做什么，但是不指定具体怎么做。
  - 声明式点一杯酒，只要告诉服务员：我要一杯酒即可；

react 的优势：

- 高效灵活
- 声明式的设计，简单使用
- 组件式开发，提高代码复用率
- 单向响应的数据流会比双向绑定的更安全，速度更快

react 有函数组件和类组件：类组件有 this 指向，状态和生命周期，函数组件没有，只有 hooks，Hooks 是 16.8 版本才新增的，给函数组件用的，让函数组件拥有类组件的功能

## jsx 语法

JSX 是 React 的核心组成部分，它使用 XML 标记的方式去直接声明界面，界面组件之间可以互相嵌套。可以理解为在 JS 中编写与 XML 类似的语言,一种定义带属性树结构（DOM 结构）的语法
可以通过各种编译器将这些标记编译成标准的 JS 语言。
可以定义包含属性的树状结构的语法，类似 HTML 标签那样的使用，而且更便于代码的阅读。

使用 JSX 语法后，你必须要引入 babel 的 JSX 解析器，把 JSX 转化成 JS 语法，这个工作会由 babel 自动完成。同时引入 babel 后，你就可以使用新的 es6 语法，babel 会帮你把 es6 语法转化成 es5 语法，兼容更多的浏览器。

## 函数组件和 class 组件区别

函数组件纯函数，输入 props，输出 jsx
函数组件没有实例，没有生命周期，没有 state
函数组件不能扩展其他方法
class 创建的组件,有自己的私有数据(this.state)和生命周期

## React 合成事件原理

1. **全局事件委托 (Event Delegation)：**
   - React **不会**为你写的**每一个** `onClick` 都去 DOM 元素上调用 `addEventListener`。
   - 相反，它在**整个应用的根节点**（在 React 17 之前是 `document`，在 React 17+ 是你 `createRoot` 的那个 DOM 节点）上只监听**一次**所有它支持的事件（如 `click`, `change`）。
2. **事件派发：**
   - 当一个原生 DOM 事件（例如一个按钮的 'click'）冒泡到这个“根节点”时，React 的总监听器会捕获它。
   - React 查看这个原生事件的 `target`，然后找出是**哪个 React 组件**触发了它。
3. **创建包装器：**
   - React **获取**这个“原生事件对象”，然后把它**包装**成一个“合成事件对象”。
   - 这个合成对象上挂载了 React 抹平差异后的 API（如 `e.preventDefault()`）。
4. **调用回调：**
   - React 将这个“合成事件” `e` 传递给你在 JSX 中定义的 `onClick` 回调函数。
   - **访问原生事件：** 如果你确实需要访问未被包装的“原生”事件对象，可以使用 `e.nativeEvent`。

### 关键点 / 陷阱

1. 事件池 (Event Pooling) - 已废除

   - **React 16 及更早：**
     - **机制：** 为了极致的性能，React 会“池化”事件对象。当你的 `onClick` 回调函数执行完毕后，React 会**立刻“回收”**这个 `e` 对象，并将其所有属性设置为 `null`。
     - **陷阱：** 这导致你**无法**在**异步**操作（如 `setTimeout` 或 `Promise`）中访问 `e.target`。
     - **旧版解决：** 必须手动调用 `e.persist()` 来“脱离”事件池。
   - **React 17 及以后：**
     - **变更：** React **完全移除了事件池**。
     - **效果：** `e` 对象在你的回调函数执行后**不再**被回收。你现在可以安全地在 `setTimeout` 等异步代码中访问 `e.target`，**不再需要**调用 `e.persist()`。

2. 委托根节点 (Delegation Root)

   - **React 16 及更早：**
     - React 总是将所有事件委托到 `document` 级别。
   - **React 17 及以后：**
     - React 将事件委托到你调用 `ReactDOM.createRoot()` 的**应用根 DOM 节点**上。
     - **好处：** 这使得在一个页面中“渐进式升级”或“嵌套”多个 React 应用版本成为可能，而不会互相干扰事件系统。

## MVC 和 MVVM 的区别

- MVC 和 MVVM 都是常见的软件架构思想
- MVC
  - model: 数据层
  - view: 视图层
  - controller: 控制层
- MVC 的通信方式： view -> controller -> model -> view
- MVVM
  - model: 数据层
  - view: 视图层
  - viewModel: 视图模型层
- MVVM 的通信方式： view <-> viewmodel -><- model

## 生命周期

- **初始化阶段**
  constructor 是一个特殊的函数，当这个类被实例化的时候，自动执行，最先执行，只执行一次
  初始化 props 和 state
- **挂载阶段**
  UNSAFE\_ 前面有这个的就是被废弃了 带 Will 的一般都被废弃了 16.3 版本
  _UNSAFE_componentWillMount()_
  _render()_ - return 标签渲染页面
  _componentDidMount()_
  数据请求 这里面基本上什么都可以写了
  只能在 componentDidMount 里面请求数据 由于 fiber 算法的存在 在别的生命周期里每个片都会请求一次数据多次请求
- **数据更新阶段**

  - _shouldComponentUpdate()_
    作用：使用 shouldComponentUpdate 就是为了减少 render 不必要的渲染
    一定要返回一个布尔值
    里面手动判断页面是否需要渲染
    shouldComponentUpdate 提供了两个参数 nextProps 和 nextState，表示下一次 props 和一次 state 的值，当函数返回 false 时候，render()方法不执行，组件也就不会渲染，返回 true 时，组件照常重渲染
    当传递的是一个复杂对象时由于地址不相同所以就没用了
    解决：

  1. 使用 setState 改变数据之前，先采用 es6 中 assgin 进行拷贝，但是 assgin 只深拷贝的数据的第一层，所以说不是最完美的解决办法。
  2. 使用 JSON.parse(JSON.stringfy())进行深拷贝，但是遇到数据为 undefined 和函数时就会错。

  - 使用 immutable.js 进行项目的搭建。immutable 中讲究数据的不可变性，每次对数据进行操作前，都会自动的对数据进行深拷贝，项目中数据采用 immutable 的方式，可以轻松解决问题，但是又多了一套 API 去学习
    immutable.js
    Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象
    Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享

  - _UNSAFE_componentWillUpdate() {}_
  - _componentWillReceiveProps_
  - _componentWillUpdate()_
  - _render()_
  - _componentDidUpdate()_

- **销毁阶段**
  _componentWillUnmount_
  清除定时器，断开 websocket，取消事件监听，卸载第三方插件

## React 组件通信方法

在 React 中，组件是独立且可复用的。为了构建复杂的应用，组件之间需要有效地交换数据。以下是几种核心的组件通信方法。

### 1. 父组件向子组件通信 (Props)

这是最常见和最直接的通信方式。

- **核心思想**: 父组件通过 **props** 属性将数据单向传递给子组件。
- **实现**:

  1.  **父组件**: 在调用子组件时，像传递 HTML 属性一样，将数据绑定到子组件的 props 上。
  2.  **子组件**: 通过 `props` 对象接收数据。在函数组件中，`props` 是函数的第一个参数；在类组件中，通过 `this.props` 访问。

- **代码示例**:

  ```jsx
  // 父组件: ParentComponent.js
  import React from "react";
  import ChildComponent from "./ChildComponent";

  function ParentComponent() {
    const dataToSend = "Hello from Parent!";
    return <ChildComponent message={dataToSend} />;
  }

  // 子组件: ChildComponent.js
  import React from "react";

  function ChildComponent(props) {
    return <h2>{props.message}</h2>; // "Hello from Parent!"
  }
  ```

### 2. 子组件向父组件通信 (回调函数)

子组件不能直接修改父组件的状态，因此需要借助回调函数来间接通信。

- **核心思想**: 父组件将一个**函数作为 props** 传递给子组件，子组件在需要时调用这个函数，从而将数据作为函数参数传递回父组件。
- **实现**:

  1.  **父组件**: 定义一个用于更新状态的函数，并将其传递给子组件。
  2.  **子组件**: 通过 props 调用该函数，并将需要传递的数据作为参数传入。

- **代码示例**:

  ```jsx
  // 父组件: ParentComponent.js
  import React, { useState } from "react";
  import ChildComponent from "./ChildComponent";

  function ParentComponent() {
    const [messageFromChild, setMessageFromChild] = useState("");

    const handleChildData = (data) => {
      setMessageFromChild(data);
    };

    return (
      <div>
        <p>Message from child: {messageFromChild}</p>
        <ChildComponent onSendData={handleChildData} />
      </div>
    );
  }

  // 子组件: ChildComponent.js
  import React from "react";

  function ChildComponent(props) {
    const handleClick = () => {
      props.onSendData("Hi, I'm the child!");
    };
    return <button onClick={handleClick}>Send Data to Parent</button>;
  }
  ```

### 3. 跨级组件通信 (Context API)

当组件层级很深，通过 props 逐层传递数据会变得非常繁琐（即 "props drilling"），此时 Context 提供了一种更优雅的解决方案。

- **核心思想**: Context 提供了一个全局的“上下文”，允许父组件向其下任意层级的子组件直接传递数据，而无需手动逐层传递。
- **核心 API**: `React.createContext`, `Provider`, `Consumer`, `useContext` Hook。

- **实现步骤**:

  1.  **创建 Context**: 使用 `const MyContext = React.createContext(defaultValue);` 创建一个 Context 对象。
  2.  **提供 Context**: 在父组件或组件树的顶层，使用 `<MyContext.Provider value={data}>` 组件包裹所有需要访问该数据的子组件。`value` 属性就是要共享的数据。
  3.  **消费 Context**:
      - **`useContext` Hook (推荐)**: 在函数组件中，使用 `const value = useContext(MyContext);` 直接获取 `value`。这是最简洁现代的方式。
      - **`Consumer` 组件**: 在类组件或旧版函数组件中，使用 `<MyContext.Consumer>{value => /* JSX based on value */}</MyContext.Consumer>`，通过渲染属性（render prop）的方式来获取数据。

- **代码示例 (使用 `useContext`)**:

  ```jsx
  // theme-context.js
  import React, { createContext, useContext } from "react";

  // 1. 创建 Context
  const ThemeContext = createContext("light");

  // App.js (提供者)
  function App() {
    const theme = "dark";
    return (
      <ThemeContext.Provider value={theme}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }

  // Toolbar.js (中间组件)
  function Toolbar() {
    return <ThemedButton />;
  }

  // ThemedButton.js (消费者)
  function ThemedButton() {
    // 3. 使用 useContext 消费数据
    const theme = useContext(ThemeContext);
    return <button>Current theme is: {theme}</button>;
  }
  ```

### 4. 状态管理库

对于大型、复杂应用，组件间的通信关系可能错综复杂。此时，使用专门的状态管理库可以提供一个集中式、可预测的状态容器。

- **核心思想**: 将所有共享状态（state）存储在一个全局的 "Store" 中。任何组件都可以从 Store 中读取状态，并可以 "dispatch" 一个 "action" 来请求更新状态。状态的更新逻辑由 "reducer" 函数集中处理。
- **代表库**:
  - **Redux**: 经典的状态管理库，生态成熟，中间件丰富，遵循严格的单向数据流。
  - **Zustand**: 一个更轻量、更现代的状态管理方案，API 简单，基于 Hooks，无需大量模板代码。

### 5. 本地状态共享 (Hooks)

React Hooks 提供了一些强大的工具，可以在组件内部或相关组件之间共享逻辑和状态。

#### a. `useReducer`

- **核心思想**: `useReducer` 是 `useState` 的替代方案。当状态逻辑比较复杂，或者下一个状态依赖于前一个状态时，`useReducer` 更为适用。它可以看作是单个组件内部的 "小型 Redux"。
- **API**: `const [state, dispatch] = useReducer(reducer, initialState);`
  - `reducer`: 一个函数 `(state, action) => newState`，根据 action 来计算新 state。
  - `initialState`: 初始状态。
  - `dispatch`: 一个函数，用于触发 action，例如 `dispatch({ type: 'increment' })`。
- **注意**: `useReducer` 本身不处理异步操作（如 API 请求）。通常需要配合 `useEffect` 来处理副作用，例如在 `useEffect` 中获取数据，然后调用 `dispatch` 将数据存入 state。

#### b. 状态提升 (Lifting State Up)

- **核心思想**: 当多个子组件需要共享和操作同一个状态时，应将这个状态提升到它们最近的共同父组件中进行管理。然后，父组件通过 props 将状态和更新状态的函数分发给需要的子组件。
- **本质**: 这并不是一种新的技术，而是 **Props** 和 **回调函数** 模式的结合与实践，是 React 设计的核心原则之一。

### 6. 非嵌套组件通信 (发布-订阅模式)

对于两个没有任何层级关系的组件，可以使用全局事件总线（Event Bus）来实现通信。

- **核心思想**: 创建一个中央事件管理器。一个组件（发布者）可以发布（`emit`）一个事件，其他任何组件（订阅者）只要订阅（`listen` 或 `on`）了该事件，就能收到通知并执行相应的回调。
- **实现**:

  1.  引入一个事件库，如 `events` 或 `pubsub-js`。
  2.  创建一个事件发射器实例。
  3.  在组件 A 中，使用 `emitter.emit('eventName', data)` 来发布事件。
  4.  在组件 B 的 `useEffect` 中，使用 `emitter.on('eventName', callback)` 来订阅事件。
  5.  **关键**: 在组件 B 卸载时，必须在 `useEffect` 的返回函数中调用 `emitter.off('eventName', callback)` 来取消订阅，以防止内存泄漏。

- **代码示例**:

  ```jsx
  // event-bus.js
  import { EventEmitter } from "events";
  export const emitter = new EventEmitter();

  // ComponentA.js (发布者)
  import { emitter } from "./event-bus";
  function ComponentA() {
    const handleClick = () => {
      emitter.emit("message", "Hello from Component A!");
    };
    return <button onClick={handleClick}>Send Global Message</button>;
  }

  // ComponentB.js (订阅者)
  import React, { useState, useEffect } from "react";
  import { emitter } from "./event-bus";
  function ComponentB() {
    const [message, setMessage] = useState("");
    useEffect(() => {
      const handleMessage = (msg) => setMessage(msg);
      emitter.on("message", handleMessage);

      // 组件卸载时取消订阅
      return () => {
        emitter.off("message", handleMessage);
      };
    }, []); // 空依赖数组确保只在挂载和卸载时执行

    return <p>Received message: {message}</p>;
  }
  ```

---

### 总结

| 通信场景              | 推荐方法                        | 核心                                    |
| :-------------------- | :------------------------------ | :-------------------------------------- |
| **父 -> 子**          | **Props**                       | 最基础、最直接的数据传递。              |
| **子 -> 父**          | **回调函数** (通过 Props 传递)  | 子组件调用父组件的函数。                |
| **兄弟组件**          | **状态提升**                    | 将共享状态放到共同的父组件中管理。      |
| **跨多层级组件**      | **Context API** (`useContext`)  | 避免 Props 逐层钻取，实现全局数据共享。 |
| **复杂应用/全局状态** | **状态管理库** (Redux, Zustand) | 集中式、可预测的全局状态管理方案。      |
| **任意非嵌套组件**    | **发布-订阅模式** (Event Bus)   | 解耦组件，通过全局事件中心通信。        |

## 事件处理

### 1. 事件命名和绑定

- 事件名采用驼峰命名法（如 `onClick`、`onChange`）。
- 事件处理函数通常传递为函数引用，而不是字符串。

```jsx
// 正确
<button onClick={handleClick}>Click Me</button>

// 错误
<button onClick="handleClick()">Click Me</button>
```

---

### 2. 阻止默认行为和事件冒泡

React 事件对象是合成事件（SyntheticEvent），提供与原生 DOM 事件一致的接口。

```jsx
function handleSubmit(e) {
  e.preventDefault(); // 阻止默认提交
  e.stopPropagation(); // 阻止事件冒泡
}
<form onSubmit={handleSubmit}>...</form>;
```

---

### 3. 向事件处理函数传递参数

可以使用箭头函数或 bind 方法：

```jsx
<button onClick={() => handleClick(id)}>Delete</button>
<button onClick={handleClick.bind(this, id)}>Delete</button>
```

---

### 4. 事件对象

事件处理函数的第一个参数为合成事件对象（SyntheticEvent），具有和原生事件类似的属性。

```jsx
function handleChange(event) {
  console.log(event.target.value);
}
<input onChange={handleChange} />;
```

---

### 5. this 指向

- 使用 class 组件时，事件处理函数需要绑定 this，或使用箭头函数自动绑定。
- 函数组件中无需关心 this。

```jsx
// class 组件
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() { ... }
  render() {
    return <button onClick={this.handleClick}>Click</button>
  }
}
```

---

### 6. 事件池机制

- React 17 及以下，合成事件对象会被回收（事件池），异步访问事件属性时需调用 `event.persist()`。
- React 17 以上已取消事件池机制，但为兼容旧代码，可继续调用 `event.persist()`。

```jsx
function handleClick(e) {
  e.persist(); // 防止事件对象被回收
  setTimeout(() => {
    console.log(e.type);
  }, 1000);
}
```

---

### 7. 常用事件类型

| 事件类型     | 说明           |
| ------------ | -------------- |
| onClick      | 点击事件       |
| onChange     | 输入、选择改变 |
| onSubmit     | 表单提交       |
| onMouseEnter | 鼠标进入       |
| onMouseLeave | 鼠标离开       |
| onKeyDown    | 键盘按下       |
| onFocus      | 获得焦点       |
| onBlur       | 失去焦点       |

---

### 8. 事件冒泡与捕获

- React 默认事件是冒泡阶段。
- 支持捕获事件，写法如 `onClickCapture`。

```jsx
<div onClickCapture={() => console.log("捕获阶段")}></div>
```

---

### 9. 事件委托

- React 事件委托到根节点（如 `document`），提升性能。
- 组件卸载时会自动移除监听，无需手动清理。

---

### 10. 组合使用

可结合 state、props、Context 等配合事件实现复杂交互。

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 总结

- 使用合成事件，跨平台兼容。
- 事件名写法和原生不同。
- 事件处理参数、this 绑定需注意。
- 事件池影响异步操作。
- 支持事件捕获与冒泡、事件委托无需手动管理。

## 受控组件与非受控组件

受控组件与非受控组件 都是基于表单组件的
受控组件: 表单由我们自己来控制的组件
就是包含 value 属性和 onChange 事件的组件 onChange 里面写 setState 改变当前点击的 value 的值赋值给 input 绑定的 value
非受控组件就是，表单交给 react 去控制
只有文件上传一定要使用非受控组件，其他时候都尽量使用受控组件

1. 引入 createRef
2. 定义 ipt = createRef();
3. 表单上加 ref 属性

```JSX
<input type="text" ref={this.ipt}/>
```

4. 获取时用 this.ipt.current.value

## hoc 高阶组件

高阶组件是一个函数，这个函数要传入一个组件，并且返回一个新组件
高阶组件的取名一般用 with 开头，后面加功能
作用增强组件的功能,并且可以做复用
传入一个组件 return 一个功能更多的组件

高阶组件-加版权号

```JSX
const withCopy = (Comp) => {
return class extends Component {
    render() {
    return (
            <>
                {/_ {...this.props}是将接收到的 props 全部传递给子组件 _/}
                <Comp num={20} {...this.props}></Comp>
                {/_ <div>&copy;版权所有 贾滨旭 xxx </div> _/}
            </>
            );
        }
    };
};
```

## diff 算法 React Fiber 虚拟 dom

- diff 算法
  用 js 对象模拟真实的 DOM 结构 当页面更新的时候比对虚拟 dom 和真实 dom 区别 然后在进行更新 只需要更改部分不需要将页面全部重新渲染
  但是标准的的 Diff 算法复杂度需要 O(n^3)
  虚拟 dom：将真实 dom 转换成变量存到内存中
  diff 算法是一种通过同层的树节点进行比较的高效算法
  特点：

1. 同级比较
2. key 值比较
3. 类的比较
   拥有相同类的两个组件 生成相似的树形结构，
   拥有不同类的两个组件 生成不同的树形结构。
   React 里结合 Web 界面的特点做出了两个简单的假设来降低算法的复杂度
   1. 两个相同组件产生类似的 DOM 结构，不同的组件产生不同的 DOM 结构；
   2. 对于同一层次的一组子节点，它们可以通过唯一的 id 进行区分

- React Fiber
  渲染的时候将一个大的进程拆分成小的片 在每个片结束后查看一下其他的进程 然后运行小一点的进程 再去执行下一个片 例子星巴克
  虚拟 DOM
  虚拟 dom 相当于在 js 和 真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异把所记录的差异渲染再真实 dom 上，从而提高性能。

## 时间复杂度 空间复杂度

时间复杂度：是指执⾏当前算法所消耗的时间；
空间复杂度：是指执⾏当前算法需要占⽤多少内存空间
常⻅的量级有：常数阶 O(1)，对数阶 O(logN)，线性阶 O(n)，线性对数阶 O(nlogN)，平⽅阶 O(n²)，⽴⽅阶 O(n³)，K
次⽅阶 O(n^k)，指数阶

## protal 将组件放到页面中任意你想放的位置

有时需要将元素渲染到 DOM 中的不同位置上去，这是就用到的 portal 的方法 protal 可以将组件放到页面中任意你想放的位置
引入
import { createPortal } from "react-dom";
第一个参数 child 是可渲染的 react 子项，比如元素，字符串或者片段等。第二个参数 container 是一个 DOM 元素。
例子：对话框 模态框 轻提示
模态框例子

```jsx
// App.jsx
import React, { Component } from "react";
import Modal from "./Modal";
// import { createPortal } from "react-dom";

class App extends Component {
  state = {
    show: false,
  };

  open = (e) => {
    e.stopPropagation();
    this.setState({
      show: true,
    });
  };

  ok = (e) => {
    e.stopPropagation();
    this.setState({
      show: false,
    });
  };

  fn = () => {
    console.log(123);
  };

  render() {
    return (
      // portal的事件冒泡依旧会冒到原先的父元素上面
      <main onClick={this.fn}>
        <h3>对话框</h3>
        <button onClick={this.open}>Open Modal</button>
        {/* {this.state.show && <Modal />} */}
        {/* {createPortal(<Modal />, document.querySelector("body"))} */}

        <Modal
          visible={this.state.show}
          title="Basic Modal"
          okText="确定"
          onOk={this.ok}
        />
      </main>
    );
  }
}

export default App;
```

```jsx
import React, { Component } from "react";
import withPortal from "./withPortal";
import "./style.css";
import { bool, string } from "prop-types";

class Modal extends Component {
  render() {
    // console.log(this.props);
    // return (
    // <div className="modal">
    //   <div className="center">
    //     <h4>Basic Modal</h4>
    //   </div>
    // </div>;
    // );

    return (
      this.props.visible && (
        <div className="modal">
          <div className="center">
            <h4>{this.props.title}</h4>
            <button onClick={this.props.onOk}>{this.props.okText}</button>
          </div>
        </div>
      )
    );
  }
}

Modal.defaultProps = {
  visible: false,
  title: "标题",
};
Modal.propTypes = {
  visible: bool,
  title: string,
};

export default withPortal(Modal);
```

```js
import { Component } from "react";
import { createPortal } from "react-dom";

// 添加portal的高阶组件，很多的对话框都需要加到body上，所以将createPortal提出来
const withPortal = (Comp) => {
  return class extends Component {
    render() {
      return createPortal(
        // 将接收到的所有的props，传递给子组件
        <Comp {...this.props} />,
        document.querySelector("body")
      );
    }
  };
};

export default withPortal;
```

- createPortal 的优点

  1.使用 Portal 后，界面定制比较灵活，Portlet 是一个容器，通过 console 可以更改 Portlet 的位置，尺寸，级别，外观等，Portlet 内部显示的内容也会随着改变。
  2.Portal 有内部安全机制，可以在 Portal 上面定制角色、组及用户，可以指定哪些资源可以被哪些用户（组、角色）访问，对于那些不符合安全条件的用户登录，则看不到相关的资源。
  3.Portal 允许自己利用已经开发好的资源（portlet 或者网页）按照自己的喜好定制自己的首页或者网站。提升了网站的可维护性。
  4.Portal 软件里面都内置了很多其他方面的组件，比如全文检索，内容管理等。
  5.Portal 支持多渠道访问，比如：同一个 Portal 可以不用修改就可以支持手机、PDA 访问。

- createPortal 的缺点

  1.Portal 是标准的 Web 应用，不同厂商的实现不同，有学习曲线和时间成本。
  2.Portal 的性能也是一个需要考虑的因素，如果一个页面上 Portlet 数量比较多，则显示速度会比普通的页面慢很多，如果启用了 Portlet 的页面级 cache，则速度会快很多，但使用 Portal 后，性能肯定是个问题。
  3.Portal 的开发要比普通的开发步骤多，周期长，另外还要考虑一些引入了 Portal 后带来的技术细节，比如多个 Portlet 内容来自于多个独立的系统，如果使用 iFrame 带来的多 Session 的问题等等。
  4.Portal 需要自己做很多工作才能完成的，比如 SSO（Single Sign-On 单点登录）。（后面可以不说）
  5.Portal 有时候满足不了复杂项目的需要，需要自己二次开发，需要使用更专业的组件或者软件替代，比如内容管理，安全认证等领域。 6.使用 Portal 后，对于架构设计及开发过程都会产生很大影响，比如使用特定厂商的 Portal 产品后，需要使用特特定的 IDE 才能开发、部署，自动化的测试脚本的作用就会被削弱。

## React 路由

### React5

五版本路由总结 yarn add react-router-dom@5 ( 一般都用 5 版本 6 版本为新版本)
解构出的东西大写的是组件 小写的是方法 with 开头的是高阶组件 hoc 以 use 开头的是 Hocks

1.  如果项目要使用路由，那么项目的最外面要加上 BrowserRouter 组件 直接在出口文件给总的最大的组件套一个 BrowserRouter 标签
    import { BrowserRouter } from "react-router-dom";
2.  在组件中想使用路由的话在父组件引入 Link 这个 link 标签就相当于 a 标签做跳转 link 标签有一个 to 属性做跳转 to= "路径"
    写法:
    import { NavLink, Route, Switch } from "react-router-dom";
3.  对应的每一个 link 标签应该对应一个 Route 标签 Route 标签有两个属性 path="路径" componen = {要渲染的组件名}
4.  Route 标签的渲染属性有四个：

    1. componen = {要渲染的组件名}
    2. render ={
       (props) =>{
       return < 要渲染的组件名 （如果要传递 props 加 {...props}）/>
       }
       }
    3. children={Mine}
    4.

    ```jsx
    <Route path="/detail">
      <Detail />
    </Route>
    ```

    - _区别_
      路由里面最常见的渲染组件的属性是 component
      component 可以渲染类组件和函数组件

             render属性页可以渲染组件，render属性只能渲染函数组件
             render后面是可以写函数的, 那么就可以去加入逻辑判断

             children属性也可以渲染组件，也只能渲染函数组件
             不管url是否匹配，都会渲染
             如果加了Switch，那么就和render的效果一摸一样

             在Route组件的里面，直接写组件， 可以渲染类组件和函数组件
             这种方式默认是拿不到路由信息的, 除非配合withRouter高阶组件

5.  react 的路由是包容性路由 (vue 的路由是排他性路由)
    用 Switch 标签套在 Route 标签外面，如果你要匹配多个路由，你得在外面加一个盒子，确保唯一子元素，读取时从上往下读，只要有一个匹配就不往下匹配了

    exact 表示精准匹配
    Switch 表示 分支匹配， 将包容性路由变成排他性路由

    注意：

    - Vue 是排他性路由，react 默认是包容性路由
    - react 默认是 history 模式
    - exact 表示精准匹配
    - Switch 表示 分支匹配， 将包容性路由变成排他性路由
    - 如果要做二级路由的时候，一级路由不能用精准匹配
    - 路由信息要全部来自于 props

6.  路由嵌套 - 二级/多级路由
    在嵌套的子组件 也就是二级路由里面在写一个路由 link 标签 对应的 route 标签 这个组件的 props 里面就会有路由信息
    // ?. 可选链操作符 - 如果有这个属性就打印如果没有就不打印
    console.log(this.props.match?.params?.id);

7.  路由重定向
    import { Link, Route, Switch, Redirect } from "react-router-dom";
    从 react-router-dom 中解构出 Redirect 在和 Route 标签平级的地方写重定向标签

    ```jsx
    <Redirect from="要改变的路径" to="要改成什么路径" exact></Redirect>
    ```

8.  路由鉴权
    基础原理：
    把 Route 标签里面的渲染属性换成 render 里面就可以写逻辑判断了 判断 localstorage 里面是否存在 token 如果有就是登陆过 然后 return 一个要渲染成的组件 不过不存在 token 渲染登录页的组件
    写法：

    ```jsx
    <Route
      path="/mine"
      render={() => {
        if (localStorage.getItem("token")) {
          return <Mine />;
        } else {
          return <Redirect from="/mine" to="/login"></Redirect>;
        }
      }}
    ></Route>
    ```

    封装组件：
    原理：自定义一个组件 用这个组件去替换 route 标签 这个组件 return 一个 Route 标签
    写法：

    ```jsx
    // 标签部分：
    <Auth path="/mine">
      <Mine />
    </Auth>;
    // 组件部分：
    const Auth = (props) => {
      return (
        <Route
          path={props.path}
          render={() => {
            if (localStorage.getItem("token")) {
              return props.children;
            } else {
              return (
                <Redirect
                  from={props.path}
                  to={`/login?from=${props.path}`}
                ></Redirect>
              );
            }
          }}
        ></Route>
      );
    };
    ```

9.  404 页面
    404 页面一定要写在 Route 的最下面， Switch 不能少
    在所有 route 的最下面写 404 页面的 route 标签

    ```jsx
    <Route path="*" component={Not}></Route>
    ```

10. link 标签高亮
    // NavLink 具有 Link 所有的功能，并且会多一个高亮的效果
    引入的时候引入 NavLink，去替换 Link
    NavLink 标签会多一个类名 active 为这个类名添加样式即可
    添加样式尾元素写法：
    .active::before {
    content: ">";
    }

11. 让函数组件有类组件的功能 Hocks
    引入 useHistory，useParams，useLocation
    import {
    Link,
    Route,
    Switch,
    useHistory,
    useParams,
    useLocation,
    } from "react-router-dom";
    在组件里直接打印 Hocks 调用的结构就有了
    hooks 是 react16.8 版本新增的， 只能给函数组件使用
    帮助函数组件拥有类组件的功能
    所有的 hooks 都是函数
    hooks 的调用必须在函数组件的顶层

12. 路由模块化
    路由分为前端路由和后端路由，后端路由是服务器根据用户发起的请求而返回不同内容，前端路由是客户端根据不同的 URL 去切换组件；在 web 应用前端开发中，路由系统是最核心的部分，当页面的 URL 发生改变时，页面的显示结果可以根据 URL 的变化而变化，但是页面不会刷新。

- BrowserRouter 与 HashRouter 的区别：
  （1）底层原理不一样：BrowserRouter 使用的是 H5 的 history API，不兼容 IE9 及以下版本；HashRouter 使用的是 URL 的哈希值；
  （2）path 表现形式不一样：BrowserRouter 的路径中没有#,例如：localhost:3000/demo/test；HashRouter 的路径包含#,例如：localhost:3000/#/demo/test；
  （3）刷新后对路由 state 参数的影响：BrowserRouter 没有任何影响，因为 state 保存在 history 对象中；HashRouter 刷新后会导致路由 state 参数的丢失；

### React-Router6

六版本路由和五版本区别总结 yarn add react-router-dom
解构出的东西大写的是组件 小写的是方法 with 开头的是高阶组件 hoc 以 use 开头的是 Hocks

1. Switch 组件没有了 改成了 Routes， 并且 Routes 是不能少的， 会变成排他性路由 Routes 里面只能放 Route

2. 渲染组件只剩 element 一种了，里面写的是实例化的结果或者元素
   不需要加 exact，也是精准匹配
   用 element 渲染出来的组件全都是没有路由信息的
   想要有路由信息就要用 hocks
   <!-- <Route path="/" element={<Home />}></Route> -->

3. 路由嵌套 需要引入 Outlet 组件 相当于 props.children 在 Routes 里面直接做嵌套

4. link 标签里面可以传 pathname search hash state(看不见的数据传递 不显示在地址栏上面)

```jsx
<Link
  to={{
    pathname: "/about",
    search: "?a=3&b=4",
    hash: "#abc",
    state: {
      x: 10,
      y: 20,
    },
  }}
>
  about
</Link>
```

5. 编程式导航
   在组件里写一个单击事件 引入 useNavigate
   const navigate = useNavigate();
   const jump = () => {
   // 直接写路径相当于 push
   // navigate("/detail/888");

   // 相当于 replace
   // navigate("/home", { replace: true });

   // 直接写数字相当于 go 方法
   navigate(-2);
   };

6. 重定向
   Navigate 组件用于做重定向
   ```jsx
   <Route path="/" element={<Navigate to="/home"></Navigate>}></Route>
   ```

### hash 和 history

- hash
  是指 url 中#后面的部分，虽然出现在 URL 中，但不会被包括在 HTTP 请求中，这部分在服务器中会自动被忽略，但是在浏览器中可以通过 location.hash 来获取。主要是用到了，window.hashchange 事件，这个事件可以监听 url 中的 hash 值变化来进行 dom 操作。
  onhashchange 事件触发的条件：
  改变 url 地址，在最后面增加或者改变 hash 值
  改变 location.herf 或者 location.hash
  点击带有锚点的链接
  浏览器前进后退可能会导致 hash 的变化，就是两个网页地址的 hash 值不同
  实现思路：当浏览器地址栏 URl 的 hash 值发生改变时，就会触发 onhashchange 事件，这是需要通过 window.location.hash 可以拿到当前浏览器的 url 的 hash 值，执行不同的回调函数，加载不同的组件。
- history
  利用 window.history 的 api：
  主要使用到了 history.pushState()和 history.replaceState()这两个接口。二者均接收三个参数，分别是 state，title，url，
  state 用来存放将要插入 history 实体的相关信息，是一个 json 格式的参数； title 是传入 history 实体的标题，firefox 现在会自动忽略掉这个属性；
  url 用来传递新的 history 实体的相对路径，如果其值为 null 则表示当前要插入的 history 实体与前一个实体一致，没有改变。
  两者唯一的区别在于 replaceState()方法会将最新一条的 history 实体覆盖掉，而不是直接添加。
  这两个方法都不会主动触发浏览器页面的刷新，只是 history 对象包括地址栏的内容会发生改变，当触发前进后退等 history 事件时才会进行相应的响应
- 区别：
  Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
  History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
  Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

### 路由鉴权

可以在 route 中的 render 上直接做判断
定义一个 auth 的函数组件，传入一个 props，里面 path 就是 props.path
里面 render 的时候做判断 一般都是判断登没登陆过 判断 localStorage 是否有 token，如果有的话就渲染组件，如果没有的话就重定向到登录页面。

### 路由懒加载

- 从 react 中解构出 lazy 和 Suspense
- lazy 函数传入回调函数，回调函数用 import
  例：const Child = lazy(() => import("./Child"));
- lazy 方法要和 Suspense 组件一起使用
- Suspense 组件需要有一个 fallback 属性，里面写组件，当这个要引得组件还没有引来得时候渲染
- suspense 要放在要做懒加载的组件外面
  例：
  ```
    <Suspense fallback={<div>loading...</div>}>
    {this.state.isShow && <Child />}
    </Suspense>
  ```

### 自定义标签代替 a 标签跳转

- 自定义一个组件，这个组件要去做编程式导航
- 在组件中添加 list，渲染出来
- 将要做跳转的标签加上点击事件
- 如果要做跳转，首先要拿到路由信息的 history 对象
- 编程式导航 go/push/replace/goBack

## fetch 和 axios 的区别

1. axios 是一个基于 Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生 XHR 的封装，只不过它是 Promise 的实现版本，符合最新的 ES 规范，它本身具有以下特征：

- 自动转换 JSON 数据 fetch 不可以 这也就是为什么 axios 只需要一步.then
- axios 是一个基于 Promise 封装的一个 ajax 库 可以避免回调地狱 可以使用 async + await 实现同步代码
- axios 可以做拦截 请求数据之前可以做一些业务逻辑的判断 比如说判断有没有 token 如果没有 token 就取消这次请求 请求后也可以进行拦截
- 从浏览器中创建 XMLHttpRequest
- 客户端支持防止 CSRF
- 提供了一些并发请求的接口（重要，方便了很多的操作）
- 从 node.js 创建 http 请求
- 拦截请求和响应
- 转换请求和响应数据
- 超时取消请求

2. fetch 优势：
   语法简洁，更加语义化
   基于标准 Promise 实现，支持 async/await
   同构方便，使用 isomorphic-fetch
   更加底层，提供的 API 丰富（request, response）
   脱离了 XHR，是 ES 规范里新的实现方式 3. fetch 存在问题

- fetch 只对网络请求报错，对 400，500 都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
- fetch 默认不会带 cookie，需要添加配置项： fetch(url, {credentials: 'include'})
- fetch 不支持 abort，不支持超时控制，使用 setTimeout 及 Promise.reject 的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
- fetch 没有办法原生监测请求的进度，而 XHR 可以

## redux 具体流程 saga

1.  创建一个仓库文件夹
2.  从 redux 里面解构出来 createStore 定义一个 store 常量等于 createStore(reducer) 把仓库暴露出去
3.  在 createStore 里面要写一个参数 reducer 一般 reducer 都是建一个单独的 reducer 文件
4.  reducer 里面定义一个 reducer 函数并暴露出去 定义一个 defaultstate 作为 reducer 第一个参数的默认值 reducer = (state = defaultstate , action)
5.  reducer reducer 为纯函数 （一个函数的返回结果只依赖其参数，并且执行过程中没有副作用。）
    有两个参数 第一个参数是 state = defaultstate 是状态里面存放数据 第二个参数是 action 用于接收组件传递的参数
    写法：
    ```js
    const reducer = (state = defaultState, action) => {
      // type 的不同表示我们要做不同的事情
      switch (action.type) {
        case "increment":
          // 返回出来的对象会去覆盖以前的 state 对象
          return {
            // 将没有进行修改的数据全部保留下来
            ...state,
            count: state.count + 1,
          };
        case "decrement":
          // 返回出来的对象会去覆盖以前的 state 对象
          return {
            // 将没有进行修改的数据全部保留下来
            ...state,
            count: state.count - action.num,
          };
        default:
          return state;
      }
    };
    ```
6.  在入口文件引入 react-redux 并解构出 Provide 引入 store 然后 用`<Provide store = {store}></Provide>`将引入的标签包起来 然后再在组件中从 react-redux 中解构出 { connect } 组件因为他的执行结果是一个高阶组件所以暴露的时候用 connect(mapStateToProps, mapDispatchToProps)(App)

7.  connect 中有两个参数 mapStateToProps 和 mapDispatchToProps 意思是把仓库中的数据映射到 props 里面 用 this.props 可以调用
    也可以不用 connect 可以使用 react-redux 提供的两个 hocks useSelector 和 useDispatch 这两个分别是获取仓库数据和调用仓库的方法的
    **怎么使用：**
    useSelector：
    定义一个变量去接收 useSelector 的参数是一个函数 这个函数的参数就是仓库中的 state 就可以获取数据了
    const list = useSelector((state) => state.list);
    useDispatch：
    定义一个 dispatch 实例 dispatch 调用的时候可以传一个对象作为参数 这个对象就是 reducer 的第二个参数 action 就可以传 type 和数据给仓库

8.  mapStateToProps
    写法 ：
    ```jsx
    const mapStateToProps = (state) => {
      return {
        // 将仓库的 count，变成组件的 props 的 count
        count: state.count,
      };
    };
    ```
9.  mapDispatchToProps dispatch 方法就相当于调用 reducer 函数
    写法 ：

```jsx
const mapDispatchToProps = (dispatch) => {
    return {
    add(num) {
    dispatch({ type: "increment", num });
    },
};
```

10. 异步请求数据
    store.js
    在 store 中从 redux 中引入 applyMiddleware
    然后下载 thunk 异步库 import thunk from "redux-thunk";
    创建仓库 createStore(reducer, applyMiddleware(thunk))
    建一个 actionCreators.js 文件 在这个文件中写一个函数去 return 一个对象 然后再组件中在引入这个函数去调用他 这样虽然是一样的但是在这个 actionCreators.js 中写的这个函数 return 这个对象之前就可以去请求数据 但是请求到之后还是要写一个同步方法去改变仓库数据 写的这个函数就是个异步函数用这个异步方法去调同步方法改变仓库数据
    写法：

```jsx
const initAction = (list) => {
  return { type: "init", list: list };
};
export const initAsyncAction = () => {
  // 请求数据
  // Actions must be plain objects
  return (dispatch) => {
    fetch(
      "https://www.fastmock.site/mock/15579798b9f988acd4d04ff978a2bd7c/api/list"
    )
      .then((response) => response.json())
      .then((res) => {
        // return { type: "init", list: res.list };
        dispatch(initAction(res.list));
      });
  };
};
```

11. 异步请求数据 -saga 异步库
    思路：
    首先在 store 的 index 中改变写法 引 saga 异步库
    里面引入 sagas 文件
    组件中用 useEffect 去调用 dispatch 但是这里的 dispatch 被 sagas 文件拦截了 在 saga 里面进行一些操作 在 saga 里面调用 reducer 函数 请求到数据之后 将请求到的数据传递给 reducer 然后 reducer 去改变里面的数据 最后在组件中再去调用一下仓库中的数据就有请求过后的数据了
    组件中有两个 hocks 从 redux 中解构出来的 一个是调用仓库中的数据 一个是调用仓库中的 reducer 函数传入的是 action
    1. 组件中用 useEffect 去调用 dispatch 但是这里的 dispatch 被 sagas 文件拦截了
       useEffect(() => {
       dispatch({
       type: "init2",
       });
       // eslint-disable-next-line
       }, []);
       2.--_ 在 saga 里面请求数据 在 saga 里面调用 reducer 函数 请求到数据之后 将请求到的数据传递给 reducer
       import { takeEvery, put, call } from "redux-saga/effects";
       import axios from "axios";
       function_ loadFn() {
       // 先请求数据
       // call 用来请求数据
       const res = yield call(() => {
       return axios
       .get("http://www.pudge.wang:3080/api/rated/list")
       .then((res) => {
       return res.data;
       });
       });
       yield put({
       type: "init",
       list: res.result,
       });
       }
       function\* mySaga() {
       yield takeEvery("init2", loadFn);
       }
       export default mySaga;
    2. reducer 去改变里面的数据
       const reducer = (state = defaultstate, action) => {
       switch (action.type) {
       case "init":
       // console.log(action);
       // return {
       // ...state,
       // list: action.list,
       // };
       return state.set("list", action.list); //immutable 写法
       default:
       return state;
       }
       】
       最后在组件中再去调用一下仓库中的数据就有请求过后的数据了
       这里注意 组件中有两个 hocks 从 redux 中解构出来的 一个是调用仓库中的数据 一个是调用仓库中的 reducer 函数传入的是 action
       import { useSelector, useDispatch } from "react-redux";
       const list = useSelector((state) => state.get("list"));
12. 配置 saga sagas 文件里面请求数据 请求到数据之后调用 put 方法相当于
    下载 saga
    1. yarn add redux-saga
    2. 在 store 中从 redux 中引入 applyMiddleware
    3. 创建一个 sagas.js 文件 引入到 store 的 index 中
       import mySaga from "./sagas";
    4. 从 react-saga 中引入 createSagaMiddleware
       import createSagaMiddleware from "redux-saga";
    5. createSagaMiddleware 是个函数 将他的执行结果定义为一个变量
       const sagaMiddleware = createSagaMiddleware();
    6. 创建仓库 createStore(reducer, applyMiddleware(sagaMiddleware))
    7. 最后在暴露之前执行 sagaMiddleware.run(mySaga);
       **sagas 文件中写什么**
       从 redux-saga/effects 中解构 takeEvery 和 put
       import { takeEvery, put } from "redux-saga/effects";
       takeEvery:用来监听的 只要在组件里面去调用 dispatch，会优先进入 mySaga 函数
       第一个参数是函数名，对应的是组件的 dispatch 的 type
       第二个参数是回调函数
       put：用来调用 reducer 的函数
       call：用来做数据请求的
       里面写一个生成器函数 调用 takeEvery 函数 里面有两个参数 第一个参数是组件调用 dispatch 时候的名字 第二个参数是一个函数可以接收一个参数相当于 reducer 中的 action 第二个参数对应的函数中写 put 函数 put 就相当于调用 dispatch
       执行的时候会先到 sagas 这个文件里面来执行过之后再到 reducer
       import { takeEvery, put ,call } from "redux-saga/effects";
       function* addFn(action) {
       yield put({
       type: "add",
       payload: action.payload,
       });
       }
       function* mySaga() {
       yield takeEvery("add2", addFn);
       }
       export default mySaga;
13. actionTypes 写法就是用一个文件里面定义一个常量大写并暴露出去 替换 reducer 里面的 case 的条件
14. 模块化

### thunk 和 saga 的区别

redux-thunk 和 redux-saga 处理异步任务的时机不一样。对于 redux-saga，相对于在 redux 的 action 基础上，重新开辟了一个 async action 的分支，单独处理异步任务
saga 自己有一套监听机制 saga 会比 thunk 难一点

## redux 本来是同步的，为什么它能执行异步代码（这句话就是中间件的作用）？中间件的实现原理是什么？都有哪些中间件？

redux 本来是同步的，为什么它能执行异步代码
当我们需要修改 store 中值的时候，我们是通过 dispatch(action)将要修改的值传到 reducer 中的，这个过程是同步的，如果我们要进行异步操作的时候，就需要用到中间件；中间件其实是提供了一个分类处理 action 的机会，在 middleware 中，我们可以检阅每一个流过的 action，并挑选出特定类型的 action 进行相应操作，以此来改变 action；
···
applyMiddleware 是个三级柯里化的函数。它将陆续的获得三个参数：第一个是 middlewares 数组，第二个是 Redux 原生的 createStore，最后一个是 reducer；然后 applyMiddleware 会将不同的中间件一层一层包裹到原生的 dispatch 之上；
redux-thunk 中间件的作用就是让我们可以异步执行 redux，首先检查参数 action 的类型，如果是函数的话，就执行这个 action 这个函数，并把 dispatch, getState, extraArgument 作为参数传递进去，否则就调用 next 让下一个中间件继续处理 action。
···
中间件的实现原理是什么？
中间键的原理就是将原来的 dispatch 存起来然后改变他的指向 重命名
···
都有哪些中间件？
redux-thunk
redux-saga

## React 按需加载

从 react 中解构 lazy 引入的时候用 lazy 去替换原本模块化的 import 引入 结合 Router 可以做到组件懒加载的效果
const Home = lazy(() => import('./routes/Home'))

## immutable

用于解决 JavaScript 数据修改的问题
引用数据类型之间传递的是地址 所以当修改其中一个一起改变
为了解决这个问题可以用 深 浅拷贝
JSON.parse JSON.stringfy 当对象的 value 是函数 或者 undefined 时会失效
Object.assign
但是这样会非常消耗性能 比如一个对象中某一个数据改变 会导致整个数据的地址改变 消耗内存 所以有了 immutable
**例子 ：D:\htlm5\代码\html5-3\React.js\react-basic-2110\src\19-immutable\App.jsx**

immutable 不可变数据
安装 - yarn add immutable
引入 import { Map, List, Seq, fromJS } from "immutable";

定义 immutableData

1.  Map
    import { Map } from "immutable";
    const obj = Map({
    a: 1,
    });
    获取数据用 get 方法
    obj.get('a') // 1

2.  Seq
    Seq 可以定义数组和对象
    seq 是具有惰性的, 从结果出发，不用的东西是不会执行的

3.  fromJS
    fromJS 定义的对象具有深度 里面的对象也是 immutable 对象 formJS 会递归的, 数组和对象都能用

改变数据需要新建一个变量 用 set 方法定义
const obj2 = obj.set("a", 2);

obj 于 obj2 比较的时候由于是赋值的所以是需要比较里面的数据相不相同

对象合并 - merge

定义数组 引入 List
import { List } from "immutable";
immutable 数组有一些 api，这些 api 很多和原生 api 相同
const list1 = List([1, 2]);
const list2 = list1.push(3, 4, 5); //1 2 3 4 5
const list3 = list2.unshift(0); //0 1 2 3 4 5
const list4 = list1.concat(list2, list3);
console.log(list4);
size 表示数组长度
console.log(list4.size === 13);

数组合并 immutable 数组可以使用数组的方法 所以直接 concat 就可以

## WebPack

### 1. 核心思想

Webpack 的核心思想是把您项目中的**所有资源**（JavaScript、CSS、图片、字体等）都当作“模块”。它会把这些分散的模块，按照依赖关系，**打包合并**成一个或几个浏览器能直接运行的静态文件（通常是 `bundle.js`）。

### 2. 工作机制

它的工作主要就两步：

1. **画“关系图” (构建依赖图)**：
   - Webpack 从您指定的“入口文件”（`entry`）开始。
   - 它会分析这个文件，找出它 `import` 或 `require` 了哪些其他模块（比如 `utils.js`、`style.css`）。
   - 接着，它再去分析 `utils.js` 和 `style.css`，看它们又依赖了谁。
   - 这样一直找下去，直到把项目里所有模块的依赖关系都搞清楚，形成一个完整的“依赖关系图”(Dependency Graph)。
2. **“翻译”并打包 (输出 Bundle)**：
   - 拿到这张图后，Webpack 会用 **Loader**（加载器）去“翻译”那些浏览器不认识的模块（比如把 SASS 转成 CSS，把 ES6 转成 ES5）。
   - 最后，它把所有处理好的模块，按照图上的关系，聪明地组装打包到您指定的“出口文件”（`output`）里。

### 3. 优点

对我来说，它的优点主要有三个：

1. **模块化开发**：它让我们能放心地用模块化的方式写代码（比如 ES Module），Webpack 会处理好模块间的依赖和浏览器兼容性，我们不用再关心 `<script>` 标签的顺序。
2. **性能优化**：它内置了很多优化手段，比如**代码压缩**、**Tree Shaking**（自动删除没用到的代码）、**代码分割**（按需加载），这些都能极大提升页面加载速度。
3. **生态强大**：它有 **Loader** 和 **Plugin** 这两大“法宝”。Loader 让我们能处理任何类型的资源，Plugin 则让我们能在打包的整个流程中做各种定制（比如自动生成 HTML 文件），非常灵活。

### 4. 缺点

当然，它也有两个比较明显的缺点：

1. **配置复杂**：这是它最大的门槛。`webpack.config.js` 里的配置项非常多，尤其对于新手，要配好一个项目（特别是性能优化部分）需要花不少学习成本。
2. **构建速度**：在一些特别大的项目中，它的构建速度（特别是冷启动时）可能会比较慢，需要我们花心思去做各种缓存和构建优化。

## webpack 与 grunt、gulp

相同点：都是前端构建⼯具，grunt、gulp 以前流⾏，现在 webpack 流⾏，轻量化的任务还是可以⽤ gulp 来实现。
grunt 和 gulp 是基于任务和流的：找到⼀个⼜⼀个⽂件，做链式操作更新流上的数据，这个为⼀个任务，多个任务组成整个 web 构建流程。
webpack 是一个打包模块化 javascript 的工具，在 webpack 里一切文件皆模块，通过 loader 转换文件，通过 plugin 注入钩子，最后输出由多个模块组合成的文件，webpack 专注构建模块化项目。loader 用于加载某些资源文件，plugin 用于扩展 webpack 的功能。
webpack 四个组成：⼊⼝，出⼝，loader，plugin

## 类型检查和默认值

函数式组件的默认值只能写成
App.defaultProps = {
msg : "zhangsan"
}
类组件的默认值可以在外面写
App.defaultProps = {
msg : "zhangsan"
}
也可以在类里面加一个 static 表示私有属性
static defaultProps = {
name : "wangwu"
}
static propTypes = {
name: PropTypes.string,
};
类型检查
import PropTypes from 'prop-types';
写法同默认值

## Ts 和 JS 的区别 使用 typescript 的好处

区别
Typescript 是 JavaScript 的超集，它支持所有 JavaScript 的语法，并在此基础上添加静态类型定义和面向对象的思想。最终编译成 JavaScript 运行。 TypeScript 它不是一门新的语言，而是用来规范 js 的，js 始终是一门弱类型语言 ，ts 它是 js 的超集 js 分成 EcmaScript(js 的语法规范),Dom(文档对象模型),Bom(浏览器对象模型)ts 实际上是 EcmaScript 的超集, ts 是强类型版的 js

使用 typescript 的好处

1.开源，跨平台。它本身不需要考虑运行环境的问题，所有支持 JavaScript 的地方都可以使用 typescript； 2.引入静态类型声明，减少不必要的类型判断和文档注释；
3。及早发现错误，静态类型检查 1 或编译时发现问题，不用等到运行； 4.类、接口的使用更易于构建和维护组件； 5.重构更方便可靠，适合大型项目；

## react 中的 key 有什么作用 key 发生变化会发生什么 key 值发生改变后会执行哪些生命周期函数

- react 中的 key 有什么作用

  1.简单的来说就是为了提高 diff 的同级比较的效率，避免原地复用带来的副作用
  2.react 利用 key 来识别组件，它是一种身份标识标识，就像我们的身份证用来辨识一个人一样。每个 key 对应一个组件，相同的 key react 认为是同一个组件，这样后续相同的 key 对应组件都不会被创

key 发生变化会发生什么

key 值不同组件会销毁再重新创建

key 值发生改变后会执行哪些生命周期函数

1.componentWillUnmount
2.constructor
3.componentWillMount（可以不说）
4.render
5.componentDidMount

## React 中的闭包陷阱(Closure Trap)

### 1. 什么是闭包陷阱？

在 React 的函数式组件中，**闭包陷阱**常发生在 `useEffect`、`useCallback` 等 Hooks 中。其本质是：组件中的函数（尤其是在 effect 或回调中）形成了一个闭包，捕获并持有了**旧的（过时的）state 或 props 值**。

- 核心原因

  - React 的函数组件每次渲染都是一次独立的“快照”。
  - 组件内部的所有变量（state, props）和函数，都是该次渲染“快照”的一部分。
  - 如果某个函数是在某次渲染中创建的，它就会“记住”当时的 state 和 props。
  - 如果这个函数在后续渲染中没有被更新，它“记住”的就永远是旧的值。

---

### 2. 经典陷阱案例：setInterval 计数器

- 错误示例

  ```javascript
  import React, { useState, useEffect } from "react";

  function IntervalCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const intervalId = setInterval(() => {
        // 这里形成了闭包，count 永远是初始值
        console.log(`正在更新 count... 闭包中捕获的 count 值是 ${count}`);
        setCount(count + 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }, []); // 依赖数组为空，仅组件挂载时运行一次

    return <h1>{count}</h1>;
  }
  ```

- 问题分析

  - 初始渲染：`count` 为 0，`useEffect` 执行，`setInterval` 的回调函数被创建。
  - 闭包形成：`setInterval` 的回调函数“记住”了初始渲染时的 `count`，这个值永远是 0。
  - 后续行为：
    1. 1 秒后，定时器触发，执行 `setCount(0 + 1)`，`count` 变为 1。
    2. 2 秒后，定时器再次触发，但回调函数闭包里的 `count` 依旧是 0，再次 `setCount(0 + 1)`。
  - **最终结果**：`count` 的值只会在 0 和 1 之间来回变化，无法持续递增。

---

### 3. 如何避免闭包陷阱？

- 方法一：正确使用依赖数组

```javascript
useEffect(() => {
  const intervalId = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(intervalId);
}, [count]); // 把 count 加入依赖数组
```

- 原理：`count` 每次改变，`useEffect` 会重新执行，旧定时器被清除，创建新定时器，捕获到最新的 `count`。
- 缺点：对于 `setInterval` 这类场景，频繁清除/创建定时器有性能开销，可能导致计时不准，通常**不推荐**。

---

- 方法二：使用函数式更新（推荐）

```javascript
useEffect(() => {
  const intervalId = setInterval(() => {
    setCount((prevCount) => prevCount + 1); // 函数式更新
  }, 1000);
  return () => clearInterval(intervalId);
}, []); // 依赖数组为空
```

- 原理：`setCount` 传入函数，React 会确保 `prevCount` 永远是**最新的状态值**。
- 优点：无须依赖外部闭包的变量，写法简洁，性能好，是最佳实践。

---

- 方法三：使用 useRef 保存最新值

适用于需要在异步回调中**读取最新 state 或 props**的场景。

```javascript
import React, { useState, useEffect, useRef } from "react";

function IntervalCounterWithRef() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 同步 ref 的值
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(countRef.current + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

- 原理：`ref` 对象在组件整个生命周期中不变。闭包捕获的是 `countRef` 这个稳定对象，通过 `.current` 总能读取到最新的 `count`。
- 优点：适用于任何需要异步回调中获取最新 state/props 的场景，通用性强。

---

### 4. 总结

- **闭包陷阱**是 React 函数组件开发中常见的陷阱，尤其在 `useEffect`、`setInterval`、异步回调等场景中。
- 推荐优先使用**函数式更新**解决闭包陷阱。
- 更复杂的场景下，可以通过 `useRef` 解决对最新 state/props 的读取问题。

---

### 5. 参考

- [React 官方文档 - Using the State Hook](https://react.dev/reference/react/useState)
- [深入理解 React Hooks 的闭包陷阱](https://juejin.cn/post/6844904186715285512)

## redux 和 mobx 的区别

mobx 和 redux 的区别主要分为以下几个方面

- **Redux：** **单一数据源 (Single Source of Truth)**
  - 整个应用的 state 被存储在一个单一的、巨大的 JavaScript 对象中（Store）。
  - 这个 state 对象是**只读的 (Immutable)**。
- **MobX：** **分散的、可观察的数据 (Observable State)**

  - 允许有多个独立的 Store 来管理不同模块的 state。
  - State 是**可变的 (Mutable)**，但这些变化是被“监视”的。

### 工作机制对比

- **Redux：** Redux 通过 dispatch 派发一个不可变的 action 动作，通过 reducer 接收，让 reducer 产生一个新的 State，View 订阅 store 的变化并且进行更新
- **MobX：** Mobx 通过 Observable 将 state 标记为可观察的，然后通过 action 直接修改 state 的属性，mobx 会自动的更新视图。

#### 1. 状态更新

- **Redux：** **严格且明确**

  1. **Action：** 必须派发（dispatch）一个“动作”（Action），这是一个描述“发生了什么”的普通对象。
  2. **Reducer：** 编写纯函数（Reducer）来接收旧的 state 和 Action。
  3. **New State：** Reducer 返回一个**全新的** state 对象，而不是修改旧的。
  4. **View：** 视图（如 React 组件）订阅 Store 的变化并更新。

  - **特点：** 流程非常清晰、可预测、可回溯。

- **MobX：** **隐式且自动**

  1. **Observable：** 将 state 标记为“可观察的”。
  2. **Action：** （可选但推荐）在一个标记为“action”的函数中，**直接修改** state 属性。
  3. **Reaction：** 视图（如 React 组件）被标记为“观察者”（Observer）。
  4. **Auto-Update：** 当被观察的 state 变化时，MobX 会自动且精确地更新“观察”了该 state 的视图。

  - **特点：** 非常自动、代码量少、“魔法”。

#### 2. 数据处理

- **Redux：** **规范化 (Normalized)**
  - 倾向于将 state 组织得像数据库一样，避免数据嵌套，使用 ID 进行关联。
  - 数据是普通的 JS 对象或数组。
- **MobX：** **嵌套 (Nested)**
  - 可以随意使用嵌套的对象和数组。
  - 数据被包装成“可观察”对象，不是普通对象。

### 内部原理对比

#### MobX 原理

- 依赖追踪

当一个被 observer 包裹的 React 组件在执行 render 时，MobX 会“监视”这个过程。它会精确地记录下这个 render 函数读取了哪些可观察（Observable）的属性。

比如，我的组件只用到了 store.user.name，MobX 就会记下：“OK，这个组件依赖 store.user.name”。它并不会关心 store.user.age 或其他数据。

- 触发反应

当我的代码通过 action 去修改（写入）这个 store.user.name 时，MobX 就会立即启动“反应”。

它会去查看它在第一步中记录的依赖列表，然后找到所有订阅了 store.user.name 的组件，并通知它们：“你依赖的数据变了，请重新渲染”。

- 总结

MobX 的高效就来自于这种精细化的订阅。它不像 Context 那样，value 一变就通知所有组件。MobX 能精确到**“哪个组件”依赖了“哪个属性”**，实现了最小范围的更新，所以性能非常好，也不需要我们手动去写 useMemo 优化

#### Redux 原理

1. Action 派发与 Reducer
   当我想更新状态时（比如点击按钮），我不能像 MobX 那样直接修改 store，我必须 dispatch（派发）一个 Action。这个 Action 是一个普通的 JavaScript 对象，比如 { type: 'SET_USER_NAME', payload: 'B' }。

   Redux 的 Store 接收到这个 Action 后，会把它和当前完整的 State 一起，传递给我预先定义好的 Reducer 函数。

   Reducer 是一个纯函数。它拿到旧的 State 和 Action，绝不会修改旧 State，而是会返回一个全新的 State 对象（这就是“不可变性”）。

2. 状态订阅与 useSelector

   Redux 的 Store 本身并不知道“哪个组件”依赖了“哪个属性”。

   在 React 中，我们使用 react-redux 的 useSelector 钩子来显式地“订阅” store 中的数据。

   比如，我的组件写了 const name = useSelector(state => state.user.name)。

   react-redux 会立即执行这个 selector 函数拿到 name，并且“记住”这个组件和它上次返回的值。

3. 更新机制：广播与浅比较

   当 Reducer 返回了全新的 State 对象后，Store 会**“广播”一个通知，告诉所有**通过 useSelector 订阅了的组件 State 改变了

   react-redux 收到通知后，会在每一个订阅的组件里，重新运行它的 selector 函数（state => state.user.name），拿到新 state 下的值。

   然后，它会用浅比较（===），对比“这次拿到的新值”和“它上次记住的旧值”。

   只有当这个值真的发生了变化时，react-redux 才会触发这个组件重新渲染。如果值没变（比如我更新的是 age，但这个组件只订阅了 name），组件就不会更新。

- 总结：

  MobX 的高效来自于**“精细化的自动追踪”**，它知道哪个属性变了，就只更新对应的组件。

  Redux 的高效则来自于**“不可变性 + 浅比较”**。它先把更新“广播”给所有订阅者，然后由 react-redux 在组件层级通过 useSelector 进行快速的浅比较，来决定是否需要重新渲染。

### 设计哲学

- **Redux：** **追求可预测性 (Predictability)**
  - 借鉴了函数式编程（FP）思想。
  - 核心是“事件溯源”，所有 state 变化都有清晰的记录（Actions），非常利于调试大型、复杂的应用（例如时间旅行调试）。
- **MobX：** **追求简洁和效率 (Simplicity & Efficiency)**
  - 借鉴了面向对象（OOP）和响应式编程（RP）思想。
  - 核心是让状态管理尽可能“透明”，开发者像操作普通 JS 对象一样操作 state，MobX 负责在背后处理更新。

### 缺点

- **Redux：**
  - **样板代码 (Boilerplate)：** 最大的问题。为了改一个简单数据，需要写 Action Type、Action Creator、Reducer case，流程很长。
  - **学习曲线：** 需要理解纯函数、Immutability、中间件（Middleware）等概念。
  - **性能：** 默认情况下，任何 dispatch 都会通知所有订阅者，可能需要手动优化（如使用 `reselect`）。
- **MobX：**
  - **“魔法” (Magic)：** 自动更新很爽，但也意味着出错时很难排查“为什么更新了”或“为什么没更新”。
  - **调试：** 不如 Redux 的“Action 日志”清晰，虽然也有工具，但可追溯性较差。
  - **规范：** 因为太灵活，团队成员可能用不同的方式修改 state，导致代码风格混乱（需要用 `action` 来约束）。

---

### 总结对比表

| **特性**         | **Redux**                               | **MobX**                          |
| ---------------- | --------------------------------------- | --------------------------------- |
| **核心范式**     | 函数式编程 (FP)                         | 响应式编程 (OOP/RP)               |
| **State 结构**   | 单一 Store，普通对象                    | 多个 Store，可观察对象            |
| **State 可变性** | **不可变 (Immutable)**                  | **可变 (Mutable)**                |
| **更新方式**     | **明确的** (Dispatch Action -> Reducer) | **隐式的** (直接修改被观察的属性) |
| **样板代码**     | 多                                      | 少                                |
| **调试**         | 极强（时间旅行）                        | 较弱（依赖追踪）                  |
| **学习曲线**     | 较陡                                    | 较平                              |
