# useMemo 与 useCallback 对比详解

在 React 中，`useMemo` 和 `useCallback` 都是用于**缓存数据或函数**、优化性能的 Hook。它们常被用来减少不必要的计算和渲染，提升应用响应速度。尽管两者用法类似，但各自有明确的适用场景和区别。

---

## 基本定义

- **useMemo**  
  用于在组件多次渲染之间**缓存一个计算值**，只有依赖项发生变化时才重新计算。

  ```js
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

- **useCallback**  
  用于在组件多次渲染之间**缓存一个函数**，只有依赖项发生变化时才生成新的函数引用。

  ```js
  const memoizedCallback = useCallback(() => {
    doSomething(a, b);
  }, [a, b]);
  ```

---

## 主要区别

| 对比项        | useMemo                                  | useCallback                          |
| ------------- | ---------------------------------------- | ------------------------------------ |
| 缓存对象类型  | **值**（任意类型，如数组、对象、结果等） | **函数**（可传递给子组件等）         |
| 返回内容      | 计算函数的返回值                         | 缓存后的函数本身                     |
| 典型场景      | 高开销的计算、过滤、生成稳定对象/数组    | 事件处理、回调、传递给 memo 子组件   |
| 用法语义      | “记住一个值”                             | “记住一个函数”                       |
| 语法          | `useMemo(fn, deps)`                      | `useCallback(fn, deps)`              |
| 依赖变化时    | 重新计算并返回新值                       | 生成新函数引用                       |
| 与 React.memo | 保证 props 数据引用稳定，减少子组件渲染  | 保证回调函数引用稳定，减少子组件渲染 |

---

## 相同点

- 都接收**依赖数组**作为第二个参数，只有依赖变化时才更新缓存。
- 都是**性能优化工具**，只在有性能瓶颈时使用，不要滥用。
- 都只能在**组件顶层**或**自定义 Hook**中使用，不能在循环或条件语句中调用。

---

## 典型用法对比

### useMemo：缓存值

适合**复杂计算**或**生成对象/数组**，如：

```js
// 过滤大数据列表
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### useCallback：缓存函数

适合**事件处理**、**回调**，尤其是**传递给子组件**时，如：

```js
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 实际案例对比

### 1. 优化子组件渲染

#### 传递稳定的数组

```js
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
<List items={visibleTodos} />; // items 引用稳定，memo 优化有效
```

#### 传递稳定的回调

```js
const handleSubmit = useCallback(
  (orderDetails) => {
    postOrder(orderDetails, productId);
  },
  [productId]
);
<Form onSubmit={handleSubmit} />; // onSubmit 引用稳定，memo 优化有效
```

---

### 2. 防止 Effect 频繁触发

#### 用 useMemo 保证对象稳定

```js
const options = useMemo(() => ({ serverUrl, roomId }), [serverUrl, roomId]);
useEffect(() => {
  connect(options);
}, [options]); // 只有 options 变才执行
```

#### 用 useCallback 保证函数稳定

```js
const createOptions = useCallback(
  () => ({ serverUrl, roomId }),
  [serverUrl, roomId]
);
useEffect(() => {
  const opts = createOptions();
  connect(opts);
}, [createOptions]); // 只有 roomId/serverUrl 变才执行
```

---

## useMemo 和 useCallback 何时用？

- 当**需要缓存“值”**（对象、数组、计算结果），用 **useMemo**。
- 当**需要缓存“函数”**（事件处理器、回调、给子组件的 props），用 **useCallback**。
- 如果你发现因为 props/函数引用变化导致子组件或 effect 频繁重复执行，就要考虑它们。
- 绝大多数情况下，`useCallback(fn, deps)` 等同于 `useMemo(() => fn, deps)`，只是语义更加明确。

---

## 常见误区

- **不要滥用**：只有当性能出现瓶颈，或者引用变化导致问题时才需要用。
- **依赖项要写全**：依赖项缺失会导致 Bug，建议配合 ESLint 规则。
- **缓存不是持久化**：React 可能在某些场景丢弃缓存（如热更新、虚拟化等），不要依赖缓存做业务逻辑。

---

## 总结

- `useMemo` 用于**缓存值**，`useCallback` 用于**缓存函数**。
- 两者都用于性能优化，常与 `React.memo`、`useEffect` 等配合。
- 选择用哪个，关键看你要缓存的是“值”还是“函数”。

> 多练习、结合实际场景体会两者区别，有助于写出高性能的 React 组件！
