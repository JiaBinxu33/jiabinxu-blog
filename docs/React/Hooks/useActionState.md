# useActionState

## 1. useActionState 简介

`useActionState` 是 React 18 引入的一个新的 Hook，主要用于在表单或交互操作中结合异步 Server Actions（如 Next.js 的 server actions）和本地 UI 状态管理。它适用于需要在用户操作后异步处理数据并反馈结果的场景，比如提交表单、批量操作等。

- `useActionState` 使得**异步操作的结果和状态管理更加集中和清晰**，尤其适合 Server Components 和结合 Next.js 的 App Router 使用。
- 其设计类似于 `useReducer`，但专为异步 Server Actions 场景优化。

## 2. 基本用法

`useActionState` 的典型用法如下：

```tsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    // 这里执行异步操作，比如调用 server action
    const result = await submitData(formData);
    return result;
  },
  initialState // 初始状态
);
```

- `state`: 当前的状态（上一次 action 的返回值）。
- `formAction`: 一个可传递给 `<form action={formAction}>` 的处理函数。
- `isPending`: 是否正在处理 action（可用于 loading 状态）。

### 示例

```tsx
"use client";

import { useActionState } from "react";

async function submit(formData) {
  // 假设这里是异步提交逻辑
  return { message: "提交成功！" };
}

export default function MyForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      return await submit(formData);
    },
    { message: "" }
  );

  return (
    <form action={formAction}>
      <input name="username" />
      <button type="submit" disabled={isPending}>
        提交
      </button>
      <p>{state.message}</p>
    </form>
  );
}
```

## 3. useActionState 的参数说明

- **处理函数**(`reducer`)：接收上一个 state 和 formData（或 action 参数），返回新的状态（可为 Promise）。
- **初始状态**(`initialState`)：第一次渲染时的状态。
- **可选依赖项**：当依赖项变化时，action state 会重置。

## 4. 使用场景

- 处理表单提交：集中管理异步提交的 loading、success、error 等 UI 状态。
- 与 Next.js 服务器 Actions 结合：直接将 server action 作为处理函数，自动管理请求状态。
- 替代 `useState` + 手动管理 loading/error，减少样板代码。

## 5. 注意事项与最佳实践

- 适合与 Server Actions/异步操作配合，不适合仅做同步本地状态管理。
- 只在客户端组件（`'use client'`）中使用。
- 返回的 `isPending` 很适合用来做按钮 loading 态或防止重复提交。
- 如果依赖外部值，记得作为依赖项传入（第三参数）。
- 对于复杂表单/多步骤，可配合 reducer 方式统一管理复杂状态。

## 6. 与其他相关 API 区别

- `useState`：简单本地状态，无异步 Action 概念。
- `useReducer`：适合复杂本地状态，但不专为异步提交优化。
- `useTransition`：用于管理 UI 过渡的异步，不直接用于表单 action。

## 7. 官方文档与推荐阅读

- [React 官方 useActionState 文档](https://react.dev/reference/react/useActionState)
- [Next.js Server Actions 与 useActionState 配合示例](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#useactionstate)

---
