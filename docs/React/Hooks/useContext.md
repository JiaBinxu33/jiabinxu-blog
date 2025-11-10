# useContext

`useContext` 是 React 提供的一个 Hook，用于在函数组件中直接读取和订阅 context 上下文数据。它极大地方便了组件间深层数据传递，避免了层层 props 传递。

---

## 基本用法

```js
const value = useContext(SomeContext);
```

- `SomeContext` 是你通过 `createContext` 创建的 context 对象。

**示例：**

```js
import { useContext } from "react";

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...可以直接用 theme 变量
}
```

---

## 主要用途

1. **向组件树深层传递数据**，比如主题、用户信息等。
2. **通过 context 实现数据的动态更新**。
3. **为 context 指定默认值，作为后备方案**。
4. **可以覆盖组件树某一部分的 context**，实现局部配置。
5. **在传递对象和函数时优化重新渲染，提升性能**。

---

## useContext 的缺陷/问题

`useContext` 最大的性能缺陷是它的“订阅”机制过于“粗糙”

- 当你的组件调用 `useContext(MyContext)` 时，它订阅的**不是** `value` 对象里的某个特定属性（比如 `username`）。
- 它订阅的是**整个 value 对象**的**引用**本身。

### 工作机制：

1. **它依赖“引用相等性”**：`useContext` 判断是否要“通知”订阅者的唯一依据，是 `Provider` 的 `value` 对象的**内存地址**是否发生了变化 ( `===` 比较)。
2. **Provider 很容易创建新引用**：当 `Provider` 的父组件重新渲染时（比如因为 `value` 里的 _任何一个_ 属性变了），它几乎总会创建一个**新的 value 对象**。
3. **它缺乏“选择器” (Selector)**：React **不知道**你的组件只关心 `value` 里的 `username`。它只知道你订阅了整个 `value`。

### 缺陷的后果

这导致了不必要渲染。

- **场景：** 假设 `value` 对象是 `{ user, theme }`。
- **组件 A**：只用了 `user`。
- **组件 B**：只用了 `theme`。
- **操作：** 组件 B 改变了 `theme`。
- **结果：**
  1. `Provider` 创建了一个新的 `value` 对象引用。
  2. React 发现 `value` 引用变了，于是**“广播”通知所有订阅者**。
  3. 组件 B（用 `theme` 的）重新渲染。**（这是必要的）**
  4. 组件 A（只用 `user` 的）也被**强制重新渲染**。**（这就是不必要的）**

### 开发体验问题：Provider 嵌套

Context 的第二个问题是代码组织。

为了避免上面说的性能问题，一种常见的做法是把状态拆分成多个小 Context，比如 UserContext、ThemeContext、ScoreContext。

但这会导致“Provider 嵌套地狱”，在应用根部会有一层又一层的 Provider 包裹，代码非常不直观，也不好维护。

### 解决办法

引入状态管理/状态下沉 (State Colocation)

状态下沉这个策略的核心是：**不要“污染”全局**。

我们不应该默认把所有的 `Context Provider` 都挂在应用的根节点（比如 `App` 组件）。而是应该让 `Provider` **尽可能地“靠近”那些真正需要**它的组件。

1. **寻找“最低公共祖先”**
   - 我们需要分析：这个 `Context`（比如 `ThemeContext`）到底被哪些组件消费了？
   - 假设，我们发现只有 `Header` 和 `Sidebar` 这两个组件分支需要“主题”状态，而页面的 `MainContent` (主内容区) 完全不需要。
   - 那么，`Header` 和 `Sidebar` 的“最低公共祖先”可能就是 `App` 下的某个 `Layout` 组件，而不是 `App` 本身。
2. **将 Provider 下沉**
   - 我们就把 `ThemeContext.Provider` 从 `App` 根部“拿下来”。
   - 把它“下沉”到那个 `Layout` 组件的 `render` 方法里，让它**只**包裹 `Header` 和 `Sidebar` 组件。

## 参数与返回值

- **参数：**  
  `SomeContext` —— 你通过 `createContext` 创建的 context 对象。本身不包含数据，只代表一种可传递的信息类型。

- **返回值：**  
  `useContext` 返回离当前组件最近的 Provider 提供的 `value`。如果上层没有 Provider，则返回创建 context 时设置的默认值（`createContext(defaultValue)` 的那个值）。

  **注意：**  
  context 的值发生变化时，React 会自动重新渲染所有使用了该 context 的组件。

---

## 注意事项

- `useContext()` 只会向上查找**调用它的组件**外层最近的 Provider，**不会受本组件内部 Provider 影响**。
- 只要 Provider 的 value 发生变化，所有下层用到该 context 的组件都会重新渲染，且 React 使用 `Object.is` 比较新旧值。
- 要保证传递 context 的对象和读取 context 的对象是**完全相同的引用**，否则会导致 context 取值失效。这点在使用 monorepo 或符号链接开发时需特别注意。

---

## 实战用法

### 1. 深层组件数据传递

```js
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={`button-${theme}`}>按钮</button>;
}

function App() {
  // ThemeContext.Provider 提供 value
  return (
    <ThemeContext.Provider value="dark">
      <Button />
    </ThemeContext.Provider>
  );
}
```

- 只要 Button 组件在 Provider 内部，无论嵌套多深，都能直接拿到 `value`。

---

### 2. 动态更新 context

```js
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

function MyApp() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        切换主题
      </button>
    </ThemeContext.Provider>
  );
}

function Form() {
  const theme = useContext(ThemeContext);
  return <div className={`form-${theme}`}>表单内容</div>;
}
```

- Provider 的 value 可以是 state，更新 state 会自动刷新下层所有依赖该 context 的组件。

---

### 3. 指定默认值

```js
const ThemeContext = createContext("light");
```

- 如果组件树中没有 Provider，`useContext(ThemeContext)` 返回的就是 `'light'`。
- 默认值不会变，只有在 Provider 缺失时才生效。

---

### 4. 覆盖部分树的 context

```js
<ThemeContext.Provider value="dark">
  <Button /> {/* 这里的按钮是 dark */}
  <ThemeContext.Provider value="light">
    <Footer /> {/* 这里的 Footer 及其子组件是 light */}
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

- 多层 Provider 可以实现局部覆盖。

---

### 5. 传递对象和函数、优化性能

```js
import { useCallback, useMemo, useState, createContext } from "react";

const AuthContext = createContext(null);

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  // 用 useCallback 保证 login 函数引用稳定
  const login = useCallback((response) => {
    // 登录逻辑...
    setCurrentUser(response.user);
  }, []);

  // 用 useMemo 保证 context value 对象引用稳定
  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

- 这样可以减少 context 变化导致的无效重渲染。

---

## 常见问题与排查

### 1. 取不到 Provider 传递的值？

- 检查 useContext 调用的组件是否确实被对应 Provider 包裹。
- 确认 Provider 和 useContext 用的是**同一个 context 对象**（不能 import 两次或路径不同）。
- 检查是否写漏了 Provider 的 `value` 属性，或属性名写错。

### 2. 总是拿到 undefined 或默认值？

- Provider 写法错误，如：

  ```jsx
  <ThemeContext>...</ThemeContext> // 错误！缺少 value
  <ThemeContext theme={theme}>...</ThemeContext> // 错误！应为 value={theme}
  ```

  正确写法应为：

  ```jsx
  <ThemeContext.Provider value={theme}>...</ThemeContext.Provider>
  ```

- 如果 Provider 的 value 是 `undefined`，下层会收到 undefined 而不是默认值。

- 只有**组件树上没有任何 Provider 时**，才会用默认值。

---

## 总结

- `useContext` 让你在任何函数组件中方便地读取 context 数据。
- 搭配 Provider 可实现全局或局部数据共享、跨层通信。
- 动态 value 结合 state 实现响应式全局数据。
- 复杂对象建议用 useMemo/useCallback 优化。
- 遇到问题多检查 Provider 包裹、value 设置和 context 对象引用。

---
