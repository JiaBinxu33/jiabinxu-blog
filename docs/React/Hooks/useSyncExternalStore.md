# React 18+ useSyncExternalStore

`useSyncExternalStore` 是 React 18 新增的一个 Hook，主要用于**订阅和读取外部存储（store）的状态**，让 React 组件能够安全、正确地和外部状态源（比如全局状态管理库、浏览器 API 等）进行同步。这个 API 主要是为**第三方状态管理库**设计的，也适合你自己实现订阅型外部数据源时使用。

---

## 场景和价值

- **状态管理库的桥梁**：如 Redux、MobX、Zustand、Recoil、Jotai 等库，未来都推荐基于这个 Hook 实现 React 绑定。
- **订阅外部全局状态**：如浏览器事件（localStorage、history、window resize、媒体查询等），或其他非 React 管理的数据源。
- **支持并发渲染（Concurrent Rendering）**：相比旧的“订阅+setState”方案，`useSyncExternalStore` 可以保证外部数据和 React 渲染同步，避免数据撕裂问题。

---

## 基本用法

```js
const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- **subscribe**：订阅外部 store 状态变化的回调。接收一个回调参数（store 变化时调用），返回取消订阅的函数。
- **getSnapshot**：同步读取当前外部 store 状态的函数，返回当前值。
- **getServerSnapshot**（可选）：SSR 场景下用于获取服务端快照，一般可忽略。

---

## 简单示例：监听浏览器窗口宽度

```js
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

function Demo() {
  const width = useWindowWidth();
  return <div>当前窗口宽度：{width}px</div>;
}
```

---

## 示例：用在状态管理库

如果你有一个全局 store（类似 Redux），可以这样写：

```js
function subscribe(callback) {
  // 假设 store 有 subscribe 方法
  return store.subscribe(callback);
}

function getSnapshot() {
  return store.getState();
}

function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
```

---

## 参数详解

- **subscribe(callback)**
  - 当外部状态变化时，调用 callback 通知 React 组件更新。
  - 返回一个取消订阅的函数。
- **getSnapshot()**
  - 读取当前外部状态（同步返回）。
  - 必须保证每次调用都能准确拿到最新值。
- **getServerSnapshot（可选）**
  - 用于 SSR 场景下服务端快照，客户端可忽略。

---

## 为什么不用 useEffect+useState 实现？

- 传统的 `useEffect + useState` 在并发渲染下可能导致**数据撕裂**（React 渲染和外部数据不同步）。
- `useSyncExternalStore` 能让 React 知道外部数据的变化和读取时机，保证一致性和正确性。

---

## 总结

- `useSyncExternalStore` 是连接外部状态和 React 组件的“官方桥梁”。
- 能保证并发渲染和 SSR/CSR 一致性，适合第三方状态库和自定义全局状态同步。
- 推荐用于“外部 store/全局状态/非 React 状态”的同步场景。
- 正确实现 subscribe/getSnapshot 就能让你的组件无缝订阅外部状态。

> 如果你只是用 React 内部状态（useState/useReducer/useContext），一般不需要用它。只有和 React 体系外的状态（全局 store、原生事件等）同步时才用。
