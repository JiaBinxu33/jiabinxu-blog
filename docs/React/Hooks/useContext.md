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

## useContext 的一些问题

1. 性能问题

当 Context 的 value 对象发生变化时，所有订阅（useContext）了这个 Context 的组件都会强制重新渲染。

这在实际中很麻烦。比如我的 value 里有 { user, score } 两个状态。如果我只是更新了 user，一个只用到了 score 的组件也会被迫重新渲染。

为了解决这个问题，我就必须手动添加大量的 React.memo 和 useMemo，，这让组件变得很臃肿，而且容易出错。

2. 开发体验问题：Provider 嵌套

Context 的第二个问题是代码组织。

为了避免上面说的性能问题，一种常见的做法是把状态拆分成多个小 Context，比如 UserContext、ThemeContext、ScoreContext。

但这会导致“Provider 嵌套地狱”，在应用根部会有一层又一层的 Provider 包裹，代码非常不直观，也不好维护。

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
