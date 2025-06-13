# useMemo

`useMemo` 是 React 提供的一个 Hook，用于在组件多次渲染时缓存某个计算过程的结果。只有依赖项发生变化时，才会重新计算，否则直接复用上一次的结果，从而优化性能、减少不必要的计算。

---

## 基本用法

```js
const cachedValue = useMemo(calculateValue, dependencies);
```

- `calculateValue`：一个**无参数的纯函数**，返回需要缓存的值。
- `dependencies`：一个依赖项数组，包含所有在计算函数中用到的响应式变量（如 props、state 等）。

**示例：**

```js
import { useMemo } from "react";

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

---

## 适用场景

- **跳过代价昂贵的重复计算**：如大型数据过滤、复杂运算等。
- **优化子组件的重新渲染**：配合 `React.memo`，避免因 props 变化导致子组件频繁渲染。
- **防止 Effect 频繁触发**：在 useEffect 依赖项中传递稳定的对象或函数引用。
- **记忆对象或函数**：避免每次渲染都创建新引用带来的性能开销。

---

## 参数与返回值

- **参数**

  - `calculateValue`：无参数纯函数，返回需缓存的值。
  - `dependencies`：依赖数组，只有内容变化时才重新计算。
    - React 使用 `Object.is` 比较依赖项是否发生变化。
    - 数组长度和顺序必须固定。

- **返回值**
  - 初次渲染时，返回 `calculateValue()` 的结果。
  - 之后只有依赖项变化时才重新计算，否则返回缓存值。

---

## 注意事项

- **useMemo 只能在组件顶层或自定义 Hook 内调用**，不能在循环或条件语句中调用。
- **开发环境下严格模式**，计算函数会被调用两次，用于帮助发现副作用，生产环境只会调用一次。
- **缓存不是永久的**：开发过程中热更新、组件初始挂载被终止、未来 React 新特性（如虚拟化）等场景下缓存会丢弃。
- **useMemo 只是性能优化手段**，不要把它当作代码正常工作的必要条件。

---

## 典型用法详解

### 跳过重复计算

```js
function TodoList({ todos, tab, theme }) {
  // filterTodos 只有 todos 或 tab 变化时才会重新运行
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

> 适合大型数组过滤、复杂运算等高开销场景。

---

### 优化子组件的渲染

```js
import { memo } from "react";

const List = memo(function List({ items }) {
  // 渲染慢的列表
});

function TodoList({ todos, tab, theme }) {
  // visibleTodos 只有依赖变化时才会变
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  return <List items={visibleTodos} />;
}
```

> 保证 props 稳定，配合 memo 包裹的子组件，实现性能提升。

---

### 防止 Effect 频繁触发

#### 错误写法（对象引用总变，Effect 频繁执行）：

```js
function ChatRoom({ roomId }) {
  const options = {
    serverUrl: "https://localhost:1234",
    roomId,
  };
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
}
```

> 每次渲染 options 都是新对象，Effect 每次都重新执行。

#### 优化写法（用 useMemo 保证 options 稳定）：

```js
function ChatRoom({ roomId }) {
  const options = useMemo(
    () => ({
      serverUrl: "https://localhost:1234",
      roomId,
    }),
    [roomId]
  );
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
}
```

> 只有 roomId 变化时 options 才会变，Effect 也只会在需要时触发。

#### 更优写法（直接在 Effect 内新建对象，最简洁）：

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const options = { serverUrl: "https://localhost:1234", roomId };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

> 推荐方式，减少 useMemo 的使用。

---

### 记忆对象和函数

#### 记忆对象

```js
const searchOptions = useMemo(
  () => ({ matchMode: "whole-word", text }),
  [text]
);
const visibleItems = useMemo(
  () => searchItems(allItems, searchOptions),
  [allItems, searchOptions]
);
```

#### 推荐写法（直接依赖基础数据）：

```js
const visibleItems = useMemo(() => {
  const searchOptions = { matchMode: "whole-word", text };
  return searchItems(allItems, searchOptions);
}, [allItems, text]);
```

#### 记忆函数（一般更推荐用 useCallback）

```js
const handleSubmit = useMemo(() => {
  return (orderDetails) => {
    post("/product/" + productId + "/buy", { referrer, orderDetails });
  };
}, [productId, referrer]);
```

用 `useCallback` 语义更直观：

```js
const handleSubmit = useCallback(
  (orderDetails) => {
    post("/product/" + productId + "/buy", { referrer, orderDetails });
  },
  [productId, referrer]
);
```

---

## 常见错误与排查

### 1. 计算函数运行两次

- 开发环境下严格模式，React 会调用两次帮助发现副作用。只要你的计算函数是纯函数，这不会影响结果。

### 2. 箭头函数直接返回对象返回了 undefined

```js
// 错误
const options = useMemo(() => {
  matchMode: "whole-word", text;
}, [text]);
// 正确：加括号或显式 return
const options = useMemo(() => ({ matchMode: "whole-word", text }), [text]);
// 或
const options = useMemo(() => {
  return { matchMode: "whole-word", text };
}, [text]);
```

### 3. 每次都重新计算（useMemo 无效）

- 忘了写依赖项数组，或者依赖项每次都是新引用（如对象/数组/函数）。
- 检查依赖项，确保它们不会在不需要的情况下发生变化。

### 4. 循环中调用 useMemo 报错

- Hook 只能在组件顶层调用，不能在循环或条件中用。
- 解决方法：将每个列表项提取为单独组件，在其内部使用 useMemo。

**错误示例：**

```js
items.map((item) => {
  const data = useMemo(() => calculate(item), [item]); // ❌
  return <Child data={data} />;
});
```

**正确示例：**

```js
items.map((item) => <MemoizedChild key={item.id} item={item} />);

function MemoizedChild({ item }) {
  const data = useMemo(() => calculate(item), [item]);
  return <Child data={data} />;
}
```

---

## 总结

- `useMemo` 主要用于缓存高开销的计算、优化性能。
- 只在确实有性能瓶颈时使用，不要滥用。
- 记得合理设置依赖项，避免无效缓存。
- 配合 `memo` 和 `useCallback`，让组件性能得到最佳优化。

> 推荐结合实际项目多加练习，理解 useMemo 的最佳用法和适用场景。
