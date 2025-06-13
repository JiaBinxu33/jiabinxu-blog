# useCallback

`useCallback` 是 React 提供的一个 Hook，用于在组件多次渲染时缓存某个函数。只有依赖项发生变化时，才会返回新函数，否则复用上一次的函数引用，常用于性能优化。

---

## 基本用法

```js
const cachedFn = useCallback(fn, dependencies);
```

- `fn`：你希望缓存的函数。可以有参数，返回任意值，但 React **不会自动调用**，只负责返回该函数本身。
- `dependencies`：依赖项数组，包含所有在 `fn` 内用到的响应式变量（如 props、state 等）。只有依赖项发生变化时才会更新函数引用。

**示例：**

```js
import { useCallback } from "react";

function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );
  // ...
}
```

---

## 适用场景

- **跳过不必要的子组件渲染**  
  和 `React.memo` 搭配，避免因为函数引用变化导致子组件重新渲染。
- **记忆化回调中安全更新 state**  
  用于事件处理、异步回调等，避免闭包陷阱。
- **防止副作用（Effect）频繁触发**  
  提供稳定的回调引用，减少不必要的 effect 执行。
- **优化自定义 Hook 的函数导出**  
  让自定义 Hook 的返回函数在依赖不变时始终保持引用不变。

---

## 参数与返回值

- **参数**

  - `fn`：要缓存的函数。
  - `dependencies`：依赖数组。React 用 `Object.is` 比较依赖项是否变化。

- **返回值**
  - 返回当前或缓存的 `fn`，只有依赖项变化时才会返回新的函数引用。

---

## 注意事项

- **只能在组件顶层或自定义 Hook 内调用**，不能在循环或条件中用。
- **开发环境热更新或组件挂载中断时，缓存会被丢弃。** 生产环境下，只有依赖变才会变。
- **仅作性能优化手段**，不要让业务逻辑依赖 useCallback，否则需先修复逻辑问题再用它优化。
- **不要滥用**，只有当真的有性能瓶颈（比如和 memo 组件配合）时再用。

---

## 常见用法详解

### 跳过子组件的重新渲染

```js
import { memo, useCallback } from "react";

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...表单内容
});

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/buy", { referrer, orderDetails });
    },
    [productId, referrer]
  );

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

> 只有当 `productId` 或 `referrer` 变化时，`handleSubmit` 才变化，ShippingForm 才会重新渲染，否则复用同一个函数引用，提升性能。

---

### 记忆化回调中安全更新 state

#### 错误写法（依赖项太多，闭包可能取到旧 state）：

```js
const handleAddTodo = useCallback(
  (text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  },
  [todos]
);
```

#### 推荐写法（用 updater，依赖项可减少到空数组）：

```js
const handleAddTodo = useCallback((text) => {
  const newTodo = { id: nextId++, text };
  setTodos((todos) => [...todos, newTodo]);
}, []);
```

> 这样不会因为 todos 变化频繁导致缓存失效，也避免了闭包陷阱。

---

### 防止 Effect 频繁触发

#### 错误写法（每次渲染函数引用都变）：

```js
function ChatRoom({ roomId }) {
  function createOptions() {
    return { serverUrl: "https://localhost:1234", roomId };
  }
  useEffect(() => {
    const options = createOptions();
    // ...
  }, [createOptions]);
}
```

#### 优化写法（用 useCallback 保证 createOptions 稳定）：

```js
const createOptions = useCallback(
  () => ({
    serverUrl: "https://localhost:1234",
    roomId,
  }),
  [roomId]
);

useEffect(() => {
  const options = createOptions();
  // ...
}, [createOptions]);
```

#### 更佳方式（直接写在 effect 内，无需 useCallback）：

```js
useEffect(() => {
  function createOptions() {
    return { serverUrl: "https://localhost:1234", roomId };
  }
  const options = createOptions();
  // ...
}, [roomId]);
```

> Effect 依赖项更明确，代码更清晰。

---

### 优化自定义 Hook

```js
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback(
    (url) => {
      dispatch({ type: "navigate", url });
    },
    [dispatch]
  );

  const goBack = useCallback(() => {
    dispatch({ type: "back" });
  }, [dispatch]);

  return { navigate, goBack };
}
```

> 这样使用者在依赖这些函数时，可以获得更好的性能优化。

---

## 疑难解答

### 1. 每次渲染 useCallback 都返回新函数？

- 检查是否正确传递了依赖数组。
- 依赖项变化会导致新函数生成。可用 console.log 检查依赖项，定位是哪个依赖导致缓存失效。

### 2. 循环中不能调用 useCallback

**错误写法：**

```js
items.map((item) => {
  const handleClick = useCallback(() => sendReport(item), [item]); // ❌
  return <Chart onClick={handleClick} />;
});
```

> Hook 只能在顶层调用，不能在循环或条件中。

**正确写法：**

```js
items.map((item) => <Report key={item.id} item={item} />);

function Report({ item }) {
  const handleClick = useCallback(() => sendReport(item), [item]);
  return <Chart onClick={handleClick} />;
}
```

或直接将 Report 包裹在 memo 中，去掉 useCallback。

---

## 总结

- `useCallback` 主要用于缓存函数，避免因函数引用变化导致子组件或 Effect 不必要地重新渲染或执行。
- 只有依赖项变化时才生成新函数，否则复用同一函数引用。
- 搭配 `React.memo`、自定义 Hook、Effect 等场景使用效果最佳。
- 只是性能优化，不要滥用，不能依赖其实现业务逻辑。

> 推荐在实际项目中多练习，理解 useCallback 的实际作用和最佳实践。
