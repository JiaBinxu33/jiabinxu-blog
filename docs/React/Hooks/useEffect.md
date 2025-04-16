# useEffect

## 参考

### useEffect(setup, dependencies?)

在组件的顶层调用 useEffect 以声明一个 useEffect：

```jsx
import { useState, useEffect } from "react";
import { createConnection } from "./chat.js";

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState("https://localhost:1234");

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[请参阅下面的更多示例。](#用法)

#### 参数

- setup：具有 useEffect 逻辑的函数。你的设置函数也可以选择返回一个清理函数。当你的组件被添加到 DOM 时，React 将运行你的设置函数。在每次使用更改的依赖重新渲染后，React 将首先使用旧值运行清理函数（如果你提供了它），然后使用新值运行你的设置函数。在你的组件从 DOM 中移除后，React 将运行你的清理函数。

- 可选 dependencies：setup 代码中引用的所有反应值的列表。反应值包括属性、状态以及直接在组件主体内声明的所有变量和函数。如果你的 linter 是 为 React 配置，它将验证每个反应值是否正确指定为依赖。依赖列表必须具有恒定数量的条目，并且像 [dep1, dep2, dep3] 一样写成内联。React 将使用 Object.is 比较将每个依赖与其先前的值进行比较。如果省略此参数，你的 useEffect 将在每次重新渲染组件后重新运行。查看传递依赖数组、空数组和完全不依赖之间的区别。

#### 返回

useEffect 返回 undefined。

#### 注意事项

- useEffect 是一个 Hook，所以你只能在你的组件的顶层或者你自己的钩子中调用它。你不能在循环或条件内调用它。如果需要，提取一个新组件并将状态移入其中。

- 如果你不尝试与某些外部系统同步，你可能不需要 useEffect

- 当严格模式打开时，React 将在第一次真正设置之前运行一个额外的仅开发设置+清理周期。这是一个压力测试，可确保你的清理逻辑 “mirrors” 你的设置逻辑，并确保它停止或撤消设置正在执行的任何操作。如果这导致问题，实现清理函数。

- 如果你的某些依赖是在组件内部定义的对象或函数，则存在它们会导致 useEffect 重新运行频率超过所需频率的风险。要解决此问题，请删除不必要的 object 和 函数 依赖。你也可以在 useEffect 器之外进行 提取状态更新 和 非 React 性逻辑。

- 如果你的 useEffect 不是由交互（如点击）引起的，React 通常会让浏览器在运行你的 useEffect 之前先绘制更新的屏幕。如果你的效果正在执行一些视觉操作（例如，定位工具提示），并且延迟很明显（例如，它闪烁），请将 useEffect 替换为 useLayoutEffect。

- 如果你的效果是由交互（如点击）引起的，React 可能会在浏览器绘制更新的屏幕之前运行你的效果。这可确保事件系统可以观察到效果的结果。通常，这会按预期工作。但是，如果你必须将工作推迟到绘制之后，例如 alert()，则可以使用 setTimeout。有关更多信息，请参阅 reactwg/react-18/128。

- 即使你的效果是由交互（如点击）引起的，React 也可能允许浏览器在处理效果内的状态更新之前重新绘制屏幕。通常，这会按预期工作。但是，如果必须阻止浏览器重新绘制屏幕，则需要将 useEffect 替换为 useLayoutEffect。

- useEffect 仅在客户端上运行。它们不会在服务器渲染期间运行。

## 用法

### 连接到外部系统

有些组件在页面上显示时，需要与网络、某些浏览器 API 或第三方库保持连接。这些系统不受 React 控制，因此它们被称为外部系统。

要在组件的顶层调用 将你的组件连接到某个外部系统，，请调用 useEffect：

```jsx
import { useState, useEffect } from "react";
import { createConnection } from "./chat.js";

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState("https://localhost:1234");

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

- 你需要将两个参数传递给 useEffect：
  1. 具有连接到该系统的 setup code 的设置函数。
     - 它应该返回一个清理函数，其中包含与该系统断开连接的 清理代码。
  2. 依赖列表，包括在这些函数中使用的组件中的每个值。

**React 会在必要时调用你的设置和清理函数，这可能会发生多次：**

1. 组件挂载时运行设置代码

   ```jsx
   useEffect(() => {
     console.log("设置代码运行"); // 组件挂载时执行
     return () => {
       console.log("清理代码运行");
     };
   }, []);
   ```

   首次渲染：只有设置函数执行

   生产环境表现：组件添加到 DOM 后立即运行设置函数

   开发环境表现：在严格模式下，React 可能会先挂载 → 卸载 → 重新挂载组件来检测问题

2. 依赖项变化时的执行顺序

   ```jsx
   useEffect(() => {
     console.log("设置代码运行，当前count:", count);
     return () => {
       console.log("清理代码运行，上一个count:", count);
     };
   }, [count]); // 依赖count
   ```

   当 count 从 1 变为 2 时的执行顺序：

   清理阶段：使用旧值(1)运行清理函数

   设置阶段：使用新值(2)运行设置函数

3. 组件卸载时的清理

   ```jsx
   useEffect(() => {
     const timer = setInterval(() => {}, 1000);
     return () => {
       clearInterval(timer); // 组件卸载时执行
     };
   }, []);
   ```

   当组件从 DOM 移除时，React 会执行最后一次清理

   这是防止内存泄漏的关键机制

- 实际场景示例
  订阅数据源示例

  ```jsx
  useEffect(() => {
    console.log("订阅用户数据，ID:", userId);
    const subscription = dataSource.subscribe(userId);
    return () => {
      console.log("取消订阅，ID:", userId);
      subscription.unsubscribe();
    };
  }, [userId]); // 依赖 userId
  ```

  当 userId 变化时的执行流程：

  1. 用户 A(id=1)进入页面：

     输出："订阅用户数据，ID:1"

  2. 用户切换到用户 B(id=2)：

     输出："取消订阅，ID:1" (清理旧订阅)

     输出："订阅用户数据，ID:2" (设置新订阅)

  3. 离开页面：

     输出："取消订阅，ID:2" (最终清理)

- 为什么需要这种机制？
  资源管理：避免内存泄漏(如未清除的定时器、订阅)

  状态一致性：确保 Effect 总是使用最新的 props 和 state

  竞态条件预防：清理函数可以取消旧的异步请求

- 开发 vs 生产环境差异

  - 开发环境：

    严格模式下会故意多次挂载/卸载组件

    帮助你发现忘记清理资源的问题

  - 生产环境：

    更直接的执行流程

    但基本机制保持不变

- 最佳实践
  每个 Effect 只做一件事：

  ```jsx
  // 好：分离关注点
  useEffect(() => {
    /* 订阅逻辑 */
  }, [userId]);
  useEffect(() => {
    /* 动画逻辑 */
  }, []);
  ```

  返回清理函数：

  ```jsx
  useEffect(() => {
    const handler = () => {};
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  ```

  正确处理依赖：

  ```jsx
  useEffect(() => {
    // 依赖所有用到的外部值
  }, [count, userId]);
  ```

  理解这种"设置 → 清理 → 设置"的循环模式，是掌握 React useEffect 管理的关键。这确保了资源被正确管理，应用行为可预测。

### 自定义钩子中的封装 useEffect

useEffect 是一个 “应急方案”：，当你需要 “走出 React” 并且没有更好的内置解决方案适合你的用例时，你可以使用它们。如果你发现自己经常需要手动编写 useEffect，这通常表明你需要为组件所依赖的常见行为提取一些 自定义钩子。

例如，这个 useChatRoom 自定义钩子 “hides” 你的 useEffect 的逻辑背后是一个更具声明性的 API：

```jsx
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

然后你可以像这样从任何组件使用它：

```jsx
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState("https://localhost:1234");

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
  });
}
// ...
```

React 生态系统中还有许多优秀的自定义钩子可用于各种用途。

### 控制非 React 小部件

有时，你希望使外部系统与组件的某些属性或状态保持同步。

例如，如果你有一个第三方地图小部件或一个没有使用 React 编写的视频播放器组件，你可以使用 useEffect 来调用它的方法，使其状态与你的 React 组件的当前状态相匹配。这个 useEffect 创建了一个在 map-widget.js 中定义的 MapWidget 类的实例。当你更改 Map 组件的 zoomLevel 属性时，useEffect 会调用类实例上的 setZoom() 以保持同步：

```jsx
import { useRef, useEffect } from "react";
import { MapWidget } from "./map-widget.js";

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return <div style={{ width: 200, height: 200 }} ref={containerRef} />;
}
```

在此示例中，不需要清理函数，因为 MapWidget 类仅管理传递给它的 DOM 节点。从树中移除 Map React 组件后，DOM 节点和 MapWidget 类实例都会被浏览器 JavaScript 引擎自动垃圾回收。

### 使用 useEffect 请求数据

你可以使用 useEffect 为你的组件获取数据。请注意，使用框架的数据请求机制的 如果你使用框架， 将比手动编写 useEffect 更有效。
如果你想手动从 useEffect 中获取数据，你的代码可能如下所示：

```jsx
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

    useEffect(() => {
    let ignore = false;  // 1. 定义标志变量
    setBio(null);        // 2. 重置状态

    fetchBio(person).then(result => {  // 3. 发起请求
        if (!ignore) {      // 4. 检查标志
        setBio(result);   // 5. 安全更新状态
        }
    });

    return () => {        // 6. 清理函数
        ignore = true;      // 7. 标记为忽略
    };
    }, [person]);          // 8. 依赖person变化

  // ...
```

- 竞态条件问题说明
  假设以下场景：

  快速切换 person 从"Alice"到"Bob"再到"Charlie"

  三个请求依次发出，但响应顺序可能是：

  Bob 的响应(慢)

  Alice 的响应(最慢)

  Charlie 的响应(最快)

  没有防护时，Alice 的响应可能最后到达，错误地覆盖了当前显示的 Charlie 的数据。

  - ignore 机制如何工作

    - 组件挂载/更新时：
      ignore 初始化为 false
      发起新请求

    - person 变化时(重新渲染)：

      - 执行上一次 Effect 的清理函数，将旧请求的 ignore 设为 true

      - 新 Effect 运行，新的 ignore 变量(false)被创建

    - 请求完成时：

      - 只有 ignore 为 false 的响应会更新状态

      - 被"忽略"的请求响应到达时不会执行 setBio

  - 为什么这种模式有效
    闭包机制：每个 Effect 调用都有自己的 ignore 变量

    执行顺序保证：React 总是先执行前一个 Effect 的清理，再运行新 Effect

    请求隔离：每个请求的响应处理只影响自己的渲染周期

  - 实际应用场景
    搜索框输入：快速连续输入时，只显示最后输入的结果

    选项卡切换：快速切换时，只显示最后选中选项卡的内容

    分页数据：快速翻页时，确保显示正确的页面数据

    - 现代替代方案
      虽然这种模式有效，但现代 React 开发更推荐：

      - 使用框架提供的数据获取：

      Next.js 的 getServerSideProps/getStaticProps

      Remix 的 loader

      React Router 的 loader

      - 使用数据获取库：

      SWR

      React Query

      Apollo Client(GraphQL)

这些方案内置了竞态条件处理、缓存、重试等高级功能。

### 指定反应依赖

#### 依赖项必须完整声明

React 强调所有在 Effect 内部使用的响应式值（reactive values）都必须声明为依赖项。响应式值包括：

- 组件 props（如 roomId）

- 组件 state（如 serverUrl）

- 组件内部定义的变量和函数

```jsx
// ✅ 正确：所有用到的响应式值都声明为依赖
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl, roomId]); // 必须包含所有依赖
```

#### 不能选择性忽略依赖

开发者不能随意挑选依赖，必须完整声明所有用到的响应式值。如果遗漏依赖：

- React 会在开发时通过 lint 规则报错

- 可能导致 Effect 无法及时响应数据变化

```jsx
// 🔴 错误：遗漏了serverUrl依赖
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  // ...
}, [roomId]); // 缺少serverUrl
```

#### 减少依赖的合法方式

如果确实需要减少依赖，应该通过代码结构调整来实现，而不是忽略 lint 警告：

- 方式一：将值移出组件

  ```jsx
  const serverUrl = "https://localhost:1234"; // 不再是响应式值

  function ChatRoom({ roomId }) {
    useEffect(() => {
      const connection = createConnection(serverUrl, roomId);
      // ...
    }, [roomId]); // ✅ 现在只需要roomId
  }
  ```

- 方式二：使用 useMemo/useCallback

```jsx
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
    // ...
  }, [options]); // ✅ 依赖更简洁
}
```

4. 空依赖数组的特殊含义

```jsx
useEffect(() => {
  // 这段代码只会在组件挂载时运行一次
}, []); // 空数组表示不依赖任何响应式值
```

空数组表示：

Effect 不依赖于任何 props 或 state

只在组件挂载时运行一次

适合初始化非 React 相关的第三方库等场景

当你的组件的任何属性或状态发生变化时，具有空依赖的 useEffect 不会重新运行。

#### 不要压制 lint 警告

官方强烈反对这种写法：

```jsx
// 🔴 危险！不要这样做
useEffect(() => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

压制 lint 警告会导致：

难以发现的 bug

Effect 无法正确响应数据变化

代码维护困难

核心思想总结

- 诚实声明依赖：Effect 用到的所有响应式值都必须声明

- 通过重构而非压制来优化：如果依赖过多，应该重构代码而非忽略警告

- 依赖项决定 Effect 的执行时机：React 根据依赖变化决定是否重新执行 Effect

- 空依赖数组有特殊含义：明确表示 Effect 不依赖任何响应式数据

### 根据 useEffect 的先前状态更新状态

当你想根据 useEffect 的先前状态更新状态时，你可能会遇到问题：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000);
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```

由于 count 是一个反应值，因此必须在依赖列表中指定它。但是，这会导致每次 count 更改时重新执行 useEffect，从而导致 intervalId 的清除和重新设置。这并不理想。

要解决此问题，通过 c => c + 1 状态更新器 到 setCount：

```jsx
import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

### 移除不必要的对象依赖

如果你的 useEffect 依赖于渲染期间创建的对象或函数，则它可能会运行得太频繁。例如，此 useEffect 在每次渲染后重新连接，因为 options 对象是 每个渲染都不同：

```jsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

修复后的代码，直接在 Effect 内部创建对象，依赖原始值

```jsx
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ serverUrl是常量，不需要作为依赖
  // ...
}
```

### 删除不必要的函数依赖

如果你的 useEffect 依赖于渲染期间创建的对象或函数，则它可能会运行得太频繁。例如，此 useEffect 在每次渲染后重新连接，因为 createOptions 函数是 每个渲染都不同：

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

函数和对象都是引用类型，作为依赖有相同的问题。

## 故障排除

### 我的 useEffect 在组件挂载时运行两次

当严格模式打开时，在开发中，React 在实际设置之前额外运行一次设置和清理。

这是一个压力测试，用于验证你的 useEffect 逻辑是否正确实现。如果这导致可见问题，则说明你的清理函数缺少某些逻辑。清理函数应该停止或撤消设置函数正在做的任何事情。经验法则是用户不应该能够区分调用一次的设置（如在生产中）和设置 → 清理 → 设置序列（如在开发中）。

### 我的 useEffect 在每次重新渲染后运行

首先，检查你是否没有忘记指定依赖数组：

```jsx
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

如果你指定了依赖数组，但你的 useEffect 仍然在循环中重新运行，那是因为你的一个依赖在每次重新渲染时都不同。

你可以通过手动将依赖记录到控制台来调试此问题：

```jsx
useEffect(() => {
  // ..
}, [serverUrl, roomId]);
console.log([serverUrl, roomId]);
```

然后，你可以在控制台中右键单击来自不同重新渲染的数组，并为它们选择 “存储为全局变量”。假设第一个保存为 temp1，第二个保存为 temp2，那么你可以使用浏览器控制台检查两个数组中的每个依赖是否相同：

```jsx
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

- [根据 useEffect 的先前状态更新状态](#根据useEffect的先前状态更新状态)

- [移除不必要的对象依赖](#移除不必要的对象依赖)

- [删除不必要的函数依赖](#删除不必要的函数依赖)

### 我的 useEffect 在无限循环中不断重新运行

如果你的 useEffect 以无限循环运行，则以下两点必须为真：

你的 useEffect 正在更新一些状态。

该状态会导致重新渲染，从而导致 useEffect 的依赖发生变化。

在开始解决问题之前，先问问自己 useEffect 是否连接到某个外部系统（如 DOM、网络、第三方小部件等）。为什么你的 useEffect 需要设置状态？它是否与该外部系统同步？或者你是否正在尝试使用它来管理应用的数据流？

如果没有外部系统，请考虑 完全删除 useEffect 是否会简化你的逻辑。

如果你真正与某个外部系统同步，请考虑你的 useEffect 应该更新状态的原因和条件。有什么改变影响了你的组件的视觉输出吗？如果你需要跟踪渲染未使用的某些数据，引用（不会触发重新渲染）可能更合适。验证你的 useEffect 不会比需要更多地更新状态（并触发重新渲染）。

最后，如果你的 useEffect 在正确的时间更新状态，但仍然存在循环，那是因为该状态更新导致 useEffect 的依赖之一发生变化。阅读[如何调试依赖更改。](#我的useEffect在无限循环中不断重新运行)

### 即使我的组件没有卸载，我的清理逻辑仍在运行

清理函数不仅在卸载期间运行，而且在每次重新渲染更改依赖之前运行。此外，在开发中，React 在组件挂载后立即额外运行一次设置+清理。

如果你有清理代码而没有相应的设置代码，通常是代码味道（Code Smell）：
Code Smell:可能存在潜在问题或不良设计模式的警示信号

```jsx
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

你的清理逻辑应该是设置逻辑的 “symmetrical”，并且应该停止或撤消任何设置所做的事情：

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}, [serverUrl, roomId]);
```

### 我的 useEffect 做了一些视觉 useEffect，我在它运行前看到了闪烁

如果你的 useEffect 必须阻止浏览器访问 绘画屏幕，，请将 useEffect 替换为 useLayoutEffect。请注意，绝大多数效果都不需要这样做。仅当在浏览器绘制之前运行效果至关重要时，你才需要它：例如，在用户看到之前测量和定位工具提示。
