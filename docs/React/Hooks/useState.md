# useState

useState 是一个 React 钩子，可让你将 状态变量 添加到组件中。

```jsx
const [state, setState] = useState(initialState);
```

## 参考

### useState(initialState)

useState(initialState)
在组件的顶层调用 useState 以声明 状态变量。

```jsx
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

约定是使用 数组解构 命名状态变量，例如 [something, setSomething]。

#### 参数

initialState：你希望状态的初始值。它可以是任何类型的值，但函数有特殊的行为。这个参数在初始渲染后被忽略。

如果你将函数作为 initialState 传递，它将被视为初始化函数。它应该是纯粹的，不带任何参数，并且应该返回任何类型的值。React 在初始化组件时会调用你的初始化函数，并将其返回值存储为初始状态。[请参见下面的示例](#用法)。

初始化参数的两种方式

- 普通初始化 useState(value) 每次渲染都会执行表达式，但只用第一次的结果 初始值简单
- 惰性初始化 useState(() => value) 只在首次渲染时执行 初始值计算复杂

```js
// 普通初始化
const [nums, setNums] = useState(new Array(1000000).fill(0)); // 每次渲染都执行一次 new Array...

// 惰性初始化
const [nums, setNums] = useState(() => new Array(1000000).fill(0)); // 只有首次渲染才执行一次
```

#### 返回

Returns

useState 返回一个恰好包含两个值的数组：

当前状态。在第一次渲染期间，它将与你传递的 initialState 相匹配。

set 函数 允许你将状态更新为不同的值并触发重新渲染。

#### 注意事项

useState 是一个 Hook，所以你只能在你的组件的顶层或者你自己的钩子中调用它。你不能在循环或条件内调用它。如果需要，提取一个新组件并将状态移入其中。

在严格模式下，React 将调用你的初始化函数两次，以便 帮助你发现意外杂质 这是仅开发行为，不会影响生产。如果你的初始化函数是纯函数（它应该是纯函数），这应该不会影响行为。其中一个调用的结果将被忽略。

### set 函数与 setSomething(nextState)类似

useState 返回的 set 函数允许你将状态更新为不同的值并触发重新渲染。你可以直接传递下一个状态，或从前一个状态计算它的函数：

```jsx
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### 参数

nextState：你希望状态成为的值。它可以是任何类型的值，但函数有特殊的行为。

如果你将函数作为 nextState 传递，它将被视为更新函数。它必须是纯粹的，应该将挂起状态作为其唯一参数，并且应该返回下一个状态。React 会将你的更新程序函数放入队列中并重新渲染你的组件。在下一次渲染期间，React 将通过将所有排队的更新器应用于前一个状态来计算下一个状态。[请参见下面的示例](#根据之前的状态更新状态)。

#### 返回

set 函数没有返回值。

#### 注意事项

- **set 函数仅更新下一次渲染的状态变量**。如果你在调用 set 函数后读取状态变量，则 **你仍然会得到旧的值** 在你调用之前显示在屏幕上。

- 如果你提供的新值与当前的 state 相同（通过 Object.is 比较确定），React 将跳过重新渲染组件及其子组件。这是一个优化。尽管在某些情况下 React 可能仍需要在跳过子级之前调用你的组件，但这不应该影响你的代码。

- React 批量状态更新。 在所有事件处理程序运行并调用其 set 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在极少数情况下，你需要强制 React 提前更新屏幕，例如访问 DOM，你可以使用 flushSync。

- set 函数具有稳定的标识，因此你经常会看到它从副作用依赖中省略，但包含它不会导致副作用触发。如果 linter 允许你在没有错误的情况下省略依赖，那么这样做是安全的。详细了解如何删除副作用依赖。

- 在渲染期间调用 set 函数只能从当前渲染组件中调用。React 将丢弃其输出并立即尝试使用新状态再次渲染它。这种模式很少需要，但你可以使用它来存储先前渲染的信息。[请参见下面的示例](#存储以前渲染的信息)。

- 在严格模式下，React 将调用你的更新程序函数两次，以便 帮助你发现意外杂质 这是仅开发行为，不会影响生产。如果你的更新程序函数是纯函数（它应该是纯函数），这应该不会影响行为。其中一个调用的结果将被忽略。

## 用法

### 向组件添加状态

在组件的顶层调用 useState 以声明一个或多个 状态变量。

```jsx
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

约定是使用 数组解构 命名状态变量，例如 [something, setSomething]。

useState 返回一个恰好包含两项的数组：

此状态变量的当前状态，初始设置为你提供的初始状态。

set 函数 允许你将其更改为任何其他值以响应交互。

要更新屏幕上的内容，请使用下一个状态调用 set 函数：

```jsx
function handleClick() {
  setName("Robin");
}
```

React 将存储下一个状态，使用新值再次渲染你的组件，并更新 UI。

#### 易犯错误

调用 set 函数 不会改变已经执行的代码中的当前状态：

```jsx
function handleClick() {
  setName("Robin");
  console.log(name); // Still "Taylor"!
}
```

它只影响 useState 从下一次渲染开始返回的内容。

### 根据之前的状态更新状态

假设 age 是 42。此处理程序调用 setAge(age + 1) 三次：

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

但是，点击之后，age 只会变成 43，而不是 45！这是因为在已经运行的代码中调用 set 函数 不会更新 age 状态变量。所以每次 setAge(age + 1) 调用都变成 setAge(43)。

为了解决这个问题，你可以将更新函数传递给 setAge 而不是下一个状态：

```jsx
function handleClick() {
  setAge((a) => a + 1); // setAge(42 => 43)
  setAge((a) => a + 1); // setAge(43 => 44)
  setAge((a) => a + 1); // setAge(44 => 45)
}
```

这里，a => a + 1 是你的更新函数。它采用 挂起状态 并从中计算出 下一个状态。

React 将你的更新函数放到 队列 中。然后，在下一次渲染期间，它将以相同的顺序调用它们：

a => a + 1 将接收 42 作为挂起状态，并返回 43 作为下一个状态。

a => a + 1 将接收 43 作为挂起状态，并返回 44 作为下一个状态。

a => a + 1 将接收 44 作为挂起状态，并返回 45 作为下一个状态。

没有其他排队的更新，所以 React 最后会将 45 存储为当前状态。

按照惯例，通常将状态变量名称的第一个字母命名为挂起状态参数，例如 a 代表 age。但是，你也可以将其称为 prevAge 或你认为更清楚的其他名称。

React 可能在开发中 [两次调用你的更新器](#我的初始化或更新函数运行两次) 以验证它们是 纯粹的。

### 更新状态中的对象和数组

你可以将对象和数组放入状态。在 React 中，状态被认为是只读的，因此你应该替换它而不是改变现有的对象。例如，如果你有一个状态为 form 的对象，不要改变它：

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = "Taylor";
```

而是，通过创建一个新对象来替换整个对象：

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: "Taylor",
});
```

### 使用键来重置状态

当 渲染列表 时，你会经常遇到 key 属性。但是，它还有另一个用途。

你可以通过将不同的 key 传递给组件来重置组件的状态。在此示例中，“重置”按钮更改 version 状态变量，我们将其作为 key 传递给 Form。当 key 改变时，React 从头开始重新创建 Form 组件（及其所有子级），因此它的状态被重置。

```jsx
import { useState } from "react";

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState("Taylor");

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name}.</p>
    </>
  );
}
```

### 存储以前渲染的信息

通常，你将在事件处理程序中更新状态。但是，在极少数情况下，你可能希望根据渲染调整状态 - 例如，你可能希望在属性更改时更改状态变量。

在大多数情况下，你不需要这样：

如果你需要的值可以完全根据当前的属性或其他状态计算出来，那么 完全删除该冗余状态。 如果你担心重新计算过于频繁，那么 useMemo 钩子 可以提供帮助。

如果你想重置整个组件树的状态，将不同的 key 传递给你的组件。

如果可以，请更新事件处理程序中的所有相关状态。

在极少数情况下，这些都不适用，你可以使用一种模式根据目前已渲染的值更新状态，方法是在组件渲染时调用 set 函数。

这是一个例子。这个 CountLabel 组件显示传递给它的 count 属性：

```jsx
export default function CountLabel({ count }) {
  return <h1>{count}</h1>;
}
```

如果你这样使用那么将会造成页面无限渲染

```jsx
function InfiniteLoopComponent() {
  const [count, setCount] = useState(0);

  // 错误：无条件调用setState
  setCount(count + 1); // 每次渲染都会触发状态更新

  return <div>Count: {count}</div>;
}
```

组件首次渲染，count 初始化为 0

执行 setCount(0 + 1)，计划将 count 更新为 1

React 重新渲染组件

再次执行 setCount(1 + 1)，计划将 count 更新为 2

这个过程会无限继续下去

## 故障排除

### 我更新了状态，但日志记录给了我旧值

调用 set 函数不会更改运行代码中的状态：

```jsx
function handleClick() {
  console.log(count); // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count); // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

这是因为 状态的行为类似于快照。 更新状态请求另一个具有新状态值的渲染，但不会影响你已经运行的事件处理程序中的 count JavaScript 变量。

如果需要使用下一个状态，可以将其保存在变量中，然后再传递给 set 函数：

```jsx
const nextCount = count + 1;
setCount(nextCount);

console.log(count); // 0
console.log(nextCount); // 1
```

### 我已经更新了状态，但是屏幕没有更新

如果下一个状态等于前一个状态（由 Object.is 比较确定），React 将忽略你的更新。当你直接更改状态中的对象或数组时，通常会发生这种情况：

```jsx
obj.x = 10; // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

你改变了一个现有的 obj 对象并将它传递回 setObj，所以 React 忽略了更新。要解决此问题，你需要确保你始终是 替换状态中的对象和数组而不是改变它们：

```jsx
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10,
});
```

### 我收到错误：“太多的重新渲染”

你可能会收到一条错误消息：Too many re-renders. React limits the number of renders to prevent an infinite loop. 通常，这意味着你在渲染期间无条件设置状态，因此你的组件进入循环：渲染、设置状态（导致渲染）、渲染、设置状态（导致渲染），以此类推。通常，这是由于指定事件处理程序的错误造成的：

```jsx
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>;

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>;

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>;
```

如果找不到此错误的原因，请单击控制台中错误旁边的箭头并查看 JavaScript 堆栈以查找导致错误的特定 set 函数调用。

### 我的初始化或更新函数运行两次

在 严格模式 中，React 将调用你的一些函数两次而不是一次：

```jsx
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

这是预期的，不应破坏你的代码。

这种仅用于开发的行为可以帮助你 保持组件纯粹。 React 使用其中一个调用的结果，并忽略另一个调用的结果。只要你的组件、初始化器和更新器函数是纯函数，这就不会影响你的逻辑。但是，如果它们不小心不纯，这有助于你发现错误。

例如，这个不纯的更新函数改变了状态数组：

```jsx
setTodos((prevTodos) => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

因为 React 两次调用你的更新函数，你会看到 todo 被添加了两次，所以你会知道有一个错误。在这个例子中，你可以通过 替换数组而不是改变它 来修复错误：

```jsx
setTodos((prevTodos) => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

既然这个更新函数是纯粹的，额外调用它不会对行为产生影响。这就是为什么 React 调用它两次可以帮助你发现错误。只有组件、初始化器和更新器函数需要是纯函数。事件处理程序不需要是纯粹的，因此 React 永远不会调用你的事件处理程序两次。

### 我正在尝试将状态设置为一个函数，但它被调用了

你不能像这样将函数置于状态：

```jsx
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

因为你正在传递一个函数，React 假定 someFunction 是一个 初始化函数，而 someOtherFunction 是一个 更新函数，所以它会尝试调用它们并存储结果。要实际存储一个函数，在这两种情况下都必须将 () => 放在它们之前。然后 React 将存储你传递的函数。

```jsx
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
