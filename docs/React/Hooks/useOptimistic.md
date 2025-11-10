# useOptimistic

## 1. 它是什么？

`useOptimistic` 是一个 React19 新加入的 Hooks，它允许您在执行**异步**操作（如网络请求）时，**立即**向用户展示一个“乐观”的 UI 状态。

它**乐观地假设您的操作一定会成功**，从而在“等待”的 2 秒钟内，让 UI 感觉“零延迟”。

## 2. 为什么需要它？

这是为了解决 UI 的**滞后感**。

- **没有乐观更新（“悲观”模式）：**

  1. 用户点击“发送”按钮。
  2. UI 显示“加载中...”
  3. 等待 2 秒...
  4. 服务器返回成功。
  5. UI 才显示“发送成功”。

  - **体验：** 缓慢，卡顿。

- **使用乐观更新**

  1. 用户点击“发送”按钮。
  2. UI **立即**显示“发送成功”的状态（这是“假”的乐观状态）。
  3. **同时**，网络请求在后台**悄悄**开始。
  4. 等待 2 秒...
  5. 服务器返回成功。UI 保持不变（因为我们猜对了）。

  - **体验：** 极度流畅，操作得到了“即时反馈”。

`useOptimistic` 的作用，就是**用一个 Hook 来自动管理这个“猜”和“猜错后回滚”的复杂逻辑**。

---

## 3. Hook 签名与详解

这是 `useOptimistic` 的标准用法：

TypeScript

```
const [optimisticState, addOptimistic] = useOptimistic(
  realState,    // 参数 1: "真实状态" (安全网)
  updateFn      // 参数 2: "更新配方" (说明书)
);
```

现在，我们来详细分解您问的每一个部分。

### 参数 1：`realState` (例如：`realMessages`) - “安全网”

- **它是什么？** 这是您的**“事实来源” (Source of Truth)**。它通常是您从 useState 或 useReducer 中获得的**“真实”**状态。它代表了 100% 已被服务器“确认”的数据。
- **它的用法 (关键！)：** `useOptimistic` 会在**两个**时刻**自动**使用它：
  1. **作为“回滚”的目标 (如果失败)：** 这是 `useOptimistic` 最神奇的地方。如果您的异步 `action` **失败**了（比如 `throw new Error()`），React 会**自动**捕获这个失败，然后**立即**把 `optimisticState` **“回滚”** 到 `realState` 的状态。
  2. **作为“提交”的基础 (如果成功)：** 当您的 `action` **成功**后，您会（在 `try` 块中）调用 `setRealMessages(...)` 来更新这个“真实状态”。当 `useOptimistic` 侦测到 `realState` 发生变化时，它就知道“乐观的更新‘转正’了”，它会自动用这个新的“真实”状态来替换掉“乐观”状态。

### 参数 2：`updateFn(currentState, optimisticValue)` - “更新配方”

- **它是什么？** 它是一个**函数**，您用来定义 `addOptimistic` (返回值) 具体应该怎么做的，调用 `addOptimistic(newValue)` 时
  React 会**立即**执行这个函数

  1. **currentState** (由 React 传入)：这是**“当前”**的状态。这可能是 realState（如果是第一次乐观更新），也可能是**上一个**乐观状态（如果您连续快速地添加了多条消息）。
  2. **optimisticValue** (由 React 传入)：这就是您调用 `addOptimistic( ... )` 时**传入的那个值**。

  您**必须**在这个函数中**返回**您希望 UI **立即**展示的**“新乐观状态”**。

---

## 4. 返回值详解

### 返回值 1：`optimisticState` (例如：`optimisticMessages`) - “展示状态”

- **它是什么？** 这是一个**“混合”**状态。它**不是**真实状态。
- **它的用法：** 您**必须**在您的 UI 渲染（比如 `.map()`）中使用**这个**变量，**而不是** `realState`。
  - 在“和平时期”（没有正在进行的 `action`），`optimisticState` 的值**等于** `realState`。
  - 在“等待时期”（您调用了 `addOptimistic` 之后），`optimisticState` 的值会**“领先”**于 `realState`，它会包含您“乐观”添加的那些假数据。

### 返回值 2：`addOptimistic` (例如：`addOptimisticMessage`) - “触发器”

- **它是什么？** 这是一个**“触发乐观更新”**的函数。

- **它的用法：** 您**必须**在您的异步 `action` **开始之前**（`await` 之前）调用它。

  **例：** `addOptimisticMessage("Hello")` 当您调用它时，React 内部会：

  1. 找到您的“配方”（`updateFn`）。
  2. 执行它：`updateFn(currentState, "Hello")`。
  3. 拿到您返回的“新乐观列表”。
  4. **立即**将 `optimisticState` 更新为这个“新乐观列表”。
  5. **立即**触发 UI 重新渲染。

---

## 5. 总结：完整的工作流程

1. **用户操作：** 用户点击“发送”。
2. **action 启动：** `formAction` 被调用。
3. **触发乐观：** `addOptimisticMessage("Hello")` **立即**被调用。
4. **React 执行“配方”：** React 运行您的 `updateFn`，计算出“新的乐观列表”。
5. **UI 立即更新：** `optimisticMessages` 变成了这个“新列表”，UI **立即**重新渲染，用户**立刻**看到 "Hello"。
6. **await 开始：** `fakeSubmitAction("Hello")` **才开始**在后台运行（模拟 2 秒延迟）。
7. **（情况 A：失败）**
   - `fakeSubmitAction` 抛出错误 (`throw new Error`)。
   - `try...catch` 块捕获到错误。
   - React **自动**侦测到失败，**立即**将 `optimisticMessages` **“回滚”** 到 `realMessages`（参数 1）的状态。"Hello" 消息从 UI 上**消失**。
8. **（情况 B：成功）**
   - `fakeSubmitAction` 成功返回。
   - 您的 `try` 块调用 `setRealMessages(...)`，更新了“真实状态”。
   - React **自动**侦测到 `realMessages` 变了，它会**“确认”**乐观更新，并用**新的 `realMessages`** 替换掉 `optimisticMessages`，UI 保持不变（或“发送中”标记消失）。
