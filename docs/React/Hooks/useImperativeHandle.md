# useImperativeHandle

`useImperativeHandle` 是 React 提供的一个高级 Hook，常与 `forwardRef` 配合使用，用于**自定义暴露给父组件的 ref 实例值**。它允许你控制父组件通过 ref 能访问到哪些属性或方法，而不是将整个子组件实例或 DOM 暴露出去。

---

## 基本用法

```js
useImperativeHandle(ref, createHandle, [deps]);
```

- **ref**：父组件传递进来的 ref 对象（通常由 `forwardRef` 提供）。
- **createHandle**：返回暴露给父组件的对象（包含你希望父组件访问的方法或属性）。
- **deps**（可选）：依赖项数组，只有依赖变化时才会重新生成 handle 对象。

---

## 典型场景

- 需要让父组件通过 ref 访问子组件的某些方法（如表单校验、强制聚焦、重置状态等）。
- 不希望直接暴露子组件内部的所有内容，只暴露指定接口，保证封装性。

---

## 基本示例

```js
import React, { useRef, useImperativeHandle, forwardRef } from "react";

const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    getValue: () => {
      return inputRef.current.value;
    },
  }));

  return <input ref={inputRef} />;
});

function Parent() {
  const inputRef = useRef();

  const handleFocus = () => {
    inputRef.current.focus(); // 调用子组件暴露的 focus 方法
  };

  const handleGetValue = () => {
    alert(inputRef.current.getValue());
  };

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleFocus}>聚焦输入框</button>
      <button onClick={handleGetValue}>获取输入值</button>
    </>
  );
}
```

---

## 参数与返回值

- **ref**：由 `forwardRef` 传递进来的 ref 引用。
- **createHandle**：返回一个对象，这个对象的属性/方法会被父组件通过 ref 访问到。
- **deps**：依赖数组，handle 只有在依赖变化时才会重新生成（一般与 useMemo 类似）。

---

## 注意事项

1. **必须配合 forwardRef 使用**  
   子组件必须用 `forwardRef` 包裹，否则无法接收到 ref 参数。

2. **不要直接暴露 DOM 或内部全部内容**  
   通过 useImperativeHandle，只暴露需要的接口，保证组件内部封装性。

3. **依赖项传递**  
   如果暴露的内容依赖于组件的 state 或 props，记得把相关变量加到 deps 中。

4. **仅用于需要场景**  
   大多数情况下，推荐用 props 向下传递行为和数据。只有在必须让父组件主动调用子组件方法时才使用。

---

## 实用场景举例

- 表单组件：父组件可以通过 ref 调用子组件的校验、重置等方法。
- 自定义输入组件：父组件调用 focus、blur、select 等方法。
- 控制动画：父组件通过 ref 启动或停止子组件动画。

---

## 总结

- `useImperativeHandle` 用于定制暴露给父组件的 ref 接口，保证封装和安全。
- 必须与 `forwardRef` 配合使用。
- 只暴露必要的方法或属性，避免破坏组件的封装性。
- 使用时关注依赖项，保持暴露接口的正确性。

> 推荐只在确实需要让父组件“主动”操作子组件时使用，平时多用 props 传递数据和行为。
