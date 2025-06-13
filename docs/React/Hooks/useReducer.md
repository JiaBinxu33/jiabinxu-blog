# useReducer

`useReducer` 是 React 提供的一个 Hook，用于在组件中以 reducer 的方式管理更复杂或多步骤的状态逻辑。它常用于替代 `useState`，尤其是在 state 结构较复杂或更新逻辑较多时。

---

## 基本用法

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

- **reducer**：用于更新 state 的纯函数，签名为 `(state, action) => newState`
- **initialArg**：初始 state，可以是任意类型
- **init**（可选）：初始化函数，只在首次渲染时运行，用于生成实际的初始 state

**示例：**

```js
import { useReducer } from "react";

function reducer(state, action) {
  // 根据 action.type 返回新 state
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
}
```

---

## dispatch 函数

- `dispatch(action)` 用于触发状态更新，参数 `action` 通常为带 type 字段的对象
- 调用后不会立即改变 state，而是触发一次组件重新渲染
- 调用完 dispatch 后立刻读取 state，拿到的还是旧值

**示例：**

```js
function handleClick() {
  dispatch({ type: "incremented_age" });
}
```

---

## reducer 函数实现

通常用 switch 语句按 action.type 匹配：

```js
function reducer(state, action) {
  switch (action.type) {
    case "incremented_age":
      return { ...state, age: state.age + 1 };
    case "changed_name":
      return { ...state, name: action.nextName };
    default:
      throw Error("Unknown action: " + action.type);
  }
}
```

> 一定要返回新对象/新数组，**不要直接修改原 state**！

---

## 初始化函数（init 参数）

当初始 state 的计算较复杂时，可以用 `init` 参数优化性能，只在首次渲染时执行：

```js
function createInitialState(username) {
  // 复杂初始化逻辑
  return { todos: [...], draft: '' };
}
const [state, dispatch] = useReducer(reducer, username, createInitialState);
```

> `init` 只会在首次渲染时运行一次，避免每次渲染都做重复计算。

---

## useReducer vs useState

- `useState` 更适合简单状态或单一字段
- `useReducer` 更适合复杂对象/数组、多步骤更新、需要将更新逻辑集中管理的场景
- 代码可读性和可维护性更高

---

## 完整示例

```js
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "incremented_age":
      return { ...state, age: state.age + 1 };
    case "changed_name":
      return { ...state, name: action.nextName };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

export default function Form() {
  const [state, dispatch] = useReducer(reducer, { name: "Taylor", age: 42 });

  function handleNameChange(e) {
    dispatch({ type: "changed_name", nextName: e.target.value });
  }
  function handleIncrement() {
    dispatch({ type: "incremented_age" });
  }

  return (
    <>
      <input value={state.name} onChange={handleNameChange} />
      <button onClick={handleIncrement}>加一岁</button>
      <p>
        你好，{state.name}，你今年 {state.age} 岁。
      </p>
    </>
  );
}
```

---

## 常见陷阱与调试

### 1. dispatch 后 state 没变/屏幕没更新？

- 不能直接修改 state（如 state.age++），必须返回新对象
- 直接修改 state，React 会跳过渲染

### 2. dispatch 后部分属性丢失为 undefined？

- 返回新对象时要展开 `...state`，否则未赋值的属性会丢失

### 3. dispatch 后 state 变成 undefined？

- reducer 必须覆盖所有 action.type，最后加个 default 或 throw Error

### 4. dispatch 后立即读取 state，值没变？

- 状态更新是异步的，dispatch 后本次事件中 state 不会立即变化

### 5. 报错 “Too many re-renders”？

- 可能在渲染期间直接调用了 dispatch，正确做法是事件中调用

```js
// 错误
return <button onClick={handleClick()}>Click me</button>;

// 正确
return <button onClick={handleClick}>Click me</button>;
```

### 6. reducer/初始化函数运行两次？

- 严格模式（开发环境）下会运行两次，帮助你发现副作用。只要是纯函数，不会影响实际功能

---

## 总结

- `useReducer` 适合管理复杂、多步骤、对象/数组类型的状态
- 状态更新逻辑全部集中在 reducer，便于维护和测试
- 返回新 state，**不要直接修改原 state**
- dispatch 更新是异步的，不能立即读取到新 state
- 遇到问题多检查 reducer、action、初始值、依赖是否写对

> 建议实际项目中多用 useReducer 管理复杂表单或多字段、可组合的状态！
