# 项目亮难点

---

## 复杂多步骤表单的处理

**面试回答**

我们项目里有一个比较典型的多步骤表单场景。

这个表单虽然步骤比较多，但数据嵌套层级其实没有特别深，所以我当时没有直接引入 MobX，而是采用了**父组件统一管理数据、子组件负责各自 Step 的方式**。

具体来说，我会把每一个步骤拆成一个独立的子组件，比如 Step1、Step2、Step3，父组件负责维护整个表单的完整数据和当前步骤。

用户在当前步骤填写完成以后，点击“下一步”，我会先调用 Ant Design Form 自带的校验。只有当前步骤校验通过以后，才会拿到这个 Step 的 values，然后把这部分数据传到父组件里面，和之前步骤的数据进行合并，再进入下一步。

整体数据流大概是：

```text
当前 Step 填写
    ↓
Antd 表单校验
    ↓
校验通过
    ↓
把当前 Step 数据传给父组件
    ↓
父组件合并完整表单数据
    ↓
进入下一步
```

之所以把数据放到父组件，而不是完全放在每一个 Step 自己内部，是因为 Step 切换的时候子组件可能会卸载。如果状态全部放在子组件里，返回上一步的时候还需要额外恢复。

放在父组件以后，即使 Step 组件重新渲染或者重新挂载，之前的数据还是存在的，返回上一步的时候可以直接把对应的数据重新回填到表单。

另外我们还做了一个**本地存储的持久化**。

也就是说，在用户完成一个步骤以后，除了把数据保存到父组件，还会同步保存到 Storage。这样即使用户中途刷新页面，也不会导致之前已经填写的数据全部丢失。

所以实际上这里有两层状态：

```text
父组件 State
    ↓
当前页面生命周期内的数据

Storage
    ↓
解决刷新、重新进入后的数据恢复
```

到最后一个步骤的时候，不是每一步都单独向后端提交，而是父组件已经维护了一份完整的数据。

最后用户确认提交时，我会把所有 Step 的数据统一组装成最终参数，再调用提交接口。提交成功以后，再把对应的本地缓存清掉。

所以整个流程可以总结成：

```text
Step1
  ↓
校验
  ↓
保存到父组件 + Storage

Step2
  ↓
校验
  ↓
继续合并

Step3
  ↓
校验
  ↓
继续合并

最终确认
  ↓
拿完整 formData
  ↓
统一调用接口提交
  ↓
成功后清理缓存
```

这个项目里因为组件层级不深，而且这些状态只服务于当前这个分步表单，所以我觉得直接使用父子组件会比引入全局状态管理更简单。

但是如果这个表单继续复杂，比如步骤很多、多个 Step 之间有大量联动，或者很多不同层级的组件都要读写这些数据，我就会考虑把它抽成一个独立的 MobX Store。

如果用 MobX，我会让子组件通过 action 修改 Store，然后通过 reaction 或 autorun 监听 Store 的数据变化，自动把数据静默同步到 Storage。

同时这个 Store 我不会做成全局单例，而是绑定到整个分步表单根组件的 Context 中，让它的生命周期只跟这个表单绑定。表单关闭或者卸载以后，Store 没有引用就可以被 GC 回收，避免污染全局状态。

> 我的项目并没有用到 mobx 去做处理，因为嵌套的层级不深，这个完全可以用父子组件来做，点击下一步的时候把数据存到父组件中，在父组件里再配合做一个本地存储做持久化，如果让我用 mobx 去做的话我会在仓库中做一个 autorun 或 reaction，只要 Store 数据变动，自动静默存入 Storage，子组件通过 action 去改变这个数据就好了，然后要注意把 Store 绑定到分步表单根组件的 Context 中。当表单关闭或卸载时，Store 自动被 GC 垃圾回收，彻底避免全局状态污染。
>
> 校验规则方面我使用的是 antd 默认的校验，只有通过校验才能点击下一步。

---

**实际项目方案**

因为表单嵌套层级不深，所以没有使用 MobX。

使用：

```text
父组件
  ↓
Step1
Step2
Step3
...
```

点击下一步时：

```text
当前 Step 表单
    ↓
Antd 表单校验
    ↓
校验通过
    ↓
数据传给父组件
    ↓
父组件保存完整数据
    ↓
本地 Storage 持久化
```

---

**为什么不用 MobX？**

核心原因：

```text
嵌套层级不深
+
父子组件可以解决
+
没有必要为了简单状态引入额外状态管理
```

---

**如果使用 MobX**

可以给整个分步表单创建一个独立 Store。

子组件通过：

```text
action
```

修改 Store：

```text
子组件
  ↓
action
  ↓
Store
```

然后在 Store 中使用：

```ts
autorun();
```

或者：

```ts
reaction();
```

监听数据变化。

```text
Store 数据变化
     ↓
autorun / reaction
     ↓
自动写入 Storage
```

实现自动静默保存。

---

**Store 生命周期**

Store 不做成全局单例，而是绑定到分步表单根组件的 Context：

```text
分步表单根组件
      ↓
   Context
      ↓
   Form Store
      ↓
各个 Step 子组件
```

当整个表单关闭或者卸载：

```text
根组件卸载
   ↓
Store 失去引用
   ↓
GC 垃圾回收
```

这样可以避免全局状态污染。

---

**表单校验**

使用 Ant Design 默认表单校验。

```text
点击下一步
    ↓
Antd Form 校验
    ↓
校验失败 → 留在当前步骤
    ↓
校验成功 → 保存数据并进入下一步
```

---

**面试追问关键词**

```text
为什么不用 MobX？
→ 层级不深，父子组件足够。

数据怎么保存？
→ 父组件统一管理 + Storage 持久化。

如果换成 MobX？
→ Store + action + reaction / autorun。

怎么避免全局 Store 污染？
→ Store 挂在分步表单 Context，跟随组件生命周期。

怎么校验？
→ Antd Form 默认校验，通过后才能进入下一步。
```

---

## 美团页面迁移中的路由跳转问题

**面试回答**

> 这个问题的背景是这样的：我们当时在做 React 页面的迁移，但因为涉及**灰度逐步放量**，不能一口气全切。放量未完全的时候，命中灰度的用户要走新的 React 高性能容器，没命中的用户还是得走 Flutter 原页面。
>
> 最开始团队为了省事，把判断逻辑直接写在了 Flutter 原页面的生命周期里——也就是任何跳转都先跳到 Flutter 原页面，它内部查灰度，没命中就留在这个页面，中了灰度就再 `push` 到 React 容器页。
>
> 这么写虽然实现了灰度，但带来了两个非常恶心的体验问题：
>
> 1. **跳转闪烁**：命中灰度的用户会连跳两次，界面明显闪一下，首屏变慢。
> 2. **回退死循环**：在 React 页面点返回，退回到了那个 Flutter 原页面，结果原页面一触发 `onResume` 又自动重定向回 React 容器，导致用户**根本退不出去**。如果想在跳 React 时把原页面 `pop` 掉，又会导致回退栈层级错乱。
>
> 临时方案是在每个跳转入口，也就是点击处去查灰度，决定是发 Flutter 路由还是 React 路由。但 App 里入口太多了，业务代码被改得乱七八糟，后续放量到 100% 要下线旧代码时清理成本极高。
>
> 最终我重构了这套方案，**把灰度判断和分发下沉到了路由引擎底层，也就是 URL Rewriting。**
>
> 1. **启动预加载配置**：进入上级页面时，把最新的灰度规则预加载到内存里，毫秒级读取，避免点击跳转时请求接口卡顿。
>
> 2. **路由底层动态重写 URL Rewriting**：当业务发起跳转，比如 `AppRouter.open('/goods/detail')`，请求刚进入路由中间件时：
>
> - 拦截器先查内存里的灰度状态。
> - **如果未命中灰度**：不重写，路由原封不动，直接渲染 **Flutter 原页面**。
> - **如果命中灰度**：拦截器在**入栈前**直接把 URL 重写成高性能容器的路由，比如 `/react-container?page=goods_detail`，一步到位切过去。
>
> **之前，在 UI 层或者页面内部判断：**
>
> 你点击按钮 ➔ 触发跳转命令 ➔ **先打开 Flutter 原页面** ➔ Flutter 页面跑 `initState` ➔ 调接口查灰度 ➔ 如果中了，在 Flutter 内部再 `push` 打开高性能容器。
>
> 结果就是产生了 Flutter 页面，导致连跳两次、退不出来。或者在几十个点击按钮处逐个写灰度判断，代码乱成一团。
>
> **现在，在路由注册表 / 中间件里判断：**
>
> 你点击按钮 ➔ 触发跳转命令 ➔ **请求还没变成任何页面** ➔ 刚进路由框架的总大门 ➔ **路由框架直接把 URL 给改了** ➔ 路由框架去打开高性能容器。
>
> 结果就是 Flutter 原页面根本没机会创建，路由栈里只有高性能容器。
>
> 这样改完之后：
>
> - **完美兼顾了灰度放量**：不同用户按比例走不同的页面，完全不受影响。
> - **避免了路由栈污染**：命中灰度的用户，路由栈里**根本不会生成 Flutter 原页面**，自然彻底解决了闪屏和“退不出去”的死循环问题。
> - **对业务彻底解耦**：上层业务代码一行没动，等后续灰度放量到 100%，我们只需要在底层路由表里把默认映射改掉就行，零业务改动风险。

---

**问题背景**

```text
Flutter 原页面
        ↓
逐步迁移
        ↓
React 高性能容器
```

因为是灰度放量：

```text
未命中灰度
→ Flutter

命中灰度
→ React
```

不能一次性全部切换。

---

**原方案**

所有用户先进入 Flutter：

```text
来源页
  ↓
Flutter 原页面
  ↓
查询灰度
  ↓
命中灰度
  ↓
push React 页面
```

路由栈：

```text
[来源页]
   ↓
[Flutter 原页面]
   ↓
[React 容器页]
```

---

**原方案的问题**

#### 1. 页面闪烁

命中灰度时实际上发生两次跳转：

```text
来源页
  ↓
Flutter
  ↓
React
```

所以会产生明显闪屏。

#### 2. 返回死循环

React 返回后：

```text
React
  ↓
Flutter
  ↓
onResume
  ↓
再次检测灰度
  ↓
重新进入 React
```

导致：

```text
用户退不出去
```

---

**临时方案的问题**

把灰度判断写到每个点击入口：

```text
点击入口 A → 判断灰度
点击入口 B → 判断灰度
点击入口 C → 判断灰度
...
```

问题：

```text
入口太多
业务侵入严重
代码重复
后续下线旧逻辑成本高
```

---

**最终方案：URL Rewriting**

核心思想：

> **不要等页面创建之后再决定去哪里，而是在路由入栈之前就决定最终路由。**

流程：

```text
业务发起跳转
AppRouter.open('/goods/detail')
        ↓
路由中间件
        ↓
读取灰度状态
        ↓
判断是否重写 URL
```

未命中：

```text
/goods/detail
      ↓
Flutter 原页面
```

命中：

```text
/goods/detail
      ↓
URL Rewrite
      ↓
/react-container?page=goods_detail
      ↓
React 容器
```

---

**路由栈变化**

- 未命中灰度

```text
[来源页]
   ↓
[Flutter 原页面]
```

- 命中灰度

```text
[来源页]
   ↓
[React 容器页]
```

整个过程中：

```text
只进行一次路由入栈
```

---

**为什么能解决返回问题？**

因为命中灰度之后：

```text
Flutter 原页面根本没有创建
```

所以 React 页面返回时：

```text
[来源页]
   ↓
[React]
```

React 返回：

```text
[来源页]
```

不会再经过 Flutter，也不会再次触发灰度跳转。

---

**最终收益**

```text
灰度放量能力保留
+
只进行一次路由跳转
+
解决闪屏
+
解决返回死循环
+
避免路由栈污染
+
灰度逻辑与业务解耦
+
100% 放量后容易清理旧代码
```

---

**面试追问关键词**

为什么会退不出去？
→ React 返回 Flutter 后，Flutter 的 onResume 又执行灰度跳转。

为什么不能直接 pop Flutter？  
→ 会破坏正常路由栈层级。

为什么不在业务点击入口判断？  
→ 入口太多，侵入业务代码，维护成本高。

最终怎么解决？  
→ 把灰度判断下沉到 Route Generator / Router Interceptor。

URL Rewriting 在什么时候发生？  
→ 页面创建之前、路由入栈之前。

最终路由栈是什么？  
→ 来源页 → Flutter  
或者  
→ 来源页 → React

最大的收益是什么？  
→ 一次入栈、路由栈干净、业务无感。

## ai 实训平台-SSE (Server-Sent Events) 的实现与管理

- **面试回答**
  这个功能我是通过 fetch 去请求 SSE 接口，拿到流之后，我会通过 getReader() 不断读取数据。因为一次 read() 拿到的数据不一定就是一条完整的 SSE 消息，所以我不会直接拿这一段去渲染，而是先把它拼接到一个 缓冲区 也就是个数组 里面。

  然后按照 SSE 的消息分隔符去解析完整的数据，只处理已经完整的数据，剩下不完整的部分继续留在 缓冲区 也就是个数组 里面，和下一次读取到的数据继续拼接。这样可以避免一次数据被拆成两段之后解析失败。

  解析出真正的模型内容以后，我会把文本内容持续追加到当前消息中，再更新到页面。

  Markdown 这一块我没有自己手写 Markdown 解析器，而是使用项目里的 Markdown 组件库去渲染流式文本。

  因为模型返回的数据可能比较长，而且 Markdown 语法也可能被拆开，比如代码块的三个反引号可能分两次返回，所以流式过程中我主要保存原始字符串，然后把当前已经接收到的完整文本交给 Markdown 组件重新解析，而不是自己按照每个 chunk 去解析 Markdown。

  打字机效果也是基于已经接收到的内容逐步更新显示，而不是每收到一个网络 chunk 就直接渲染，这样可以让显示速度更稳定，也可以减少长文本下频繁渲染带来的性能问题。

- **概述**：
  与 ai 对话的时候，由于大模型需要时间来思考，如果要让大模型一下输出所有答案的话需要经历长时间的等待，用户体验不好，所以有了 sse 流式输出，就是将一个完整的 sse 事件割到多个数据块中，然后把所有解码后的字符串拼在一个大字符串里面，这个字符串可以称为缓冲区，起到缓冲的作用，检查这个结果中是否有分隔符，这个分隔符就是用来分割要展示的部分，如果你第一次要展示 a，第二次展示 b 那 a 和 b 之间就会有分隔符，如果有分隔符 `\n\n`。如果有分隔符就说明有一个完整事件，然后逐个渲染完整的事件字符串，把已经渲染的部分从缓冲区移出去，通过一个结束的标志 `data: [DONE]`决定整条回答是否结束

  在请求头中设置了 `Accept: 'text/event-stream'`，返回的是一个响应流通过 `response.body.getReader()` 获取流的读取器（reader）。然后在一个循环中不断调用 `reader.read()` 来读取数据块。

- **实现**:
  我在 `useChatAPI` 这个自定义 Hook 中封装了 SSE 的处理逻辑。通过 `fetch` API 发起流式请求（利用了 `apiClient.js` 中封装的 `postStream` 方法），然后使用 `response.body.getReader()` 和 `TextDecoder` 来逐步读取流数据。为了应对网络传输中数据块可能被分割的情况，我维护了一个缓冲区 (`buffer`)，累积接收到的数据，直到遇到 SSE 事件的分隔符 (`\n\n`) 才进行处理。解析时需要剥离 `data:` 前缀，处理 JSON 解析可能出现的异常，并特别识别流结束的标志 `[DONE]`。

- **状态更新**:
  在流式接收过程中，需要实时更新聊天界面的消息状态 (`setMessagesState`)，将接收到的文本片段累加到对应的机器人消息上，并展示加载（打字）动画。这里使用了 `useRef` (如 `currentBotMessageIdRef`) 来确保在异步回调中能正确地更新对应的消息气泡。

**错误处理**: SSE 的错误处理比较复杂。不仅要处理请求发起时的 HTTP 错误，还要处理流传输过程中可能出现的错误（比如后端模型报错并通过流返回错误信息）。我增加了逻辑来检测流数据中的错误标识，并在 UI 上将对应的消息标记为错误状态，同时确保在流结束或出错时正确释放读取器 (`reader.releaseLock()`) 并清理状态。

**SSE 错误处理**

- **EventSource 内置自动重连 (这种原生的 api 只支持 get 情求)**：

  1. 你正在接收 AI 的流式回答。
  2. 你突然走进了电梯，网络断了。
  3. `EventSource` 对象会监听到连接中断 (触发 `onerror` 事件)。
  4. 此时，它**会自动**进入重连模式。
  5. 它会每隔几秒钟（这个时间可以由服务器通过 `retry:` 字段指定，默认约 3 秒）**自动尝试重新向原来的 URL 发起连接**。
  6. 当你走出电梯，网络恢复了，它下一次重连尝试就会成功，然后继续接收数据流。

  - **需要后端配合**： 这种自动重连也需要后端设计配合。后端需要知道你是“断线重连”的，还是“发起新提问”的。 通常，浏览器重连时会发送一个特殊的 HTTP 头 `Last-Event-ID`（这个 ID 可以由服务器在上一条消息中用 `id: ...` 字段指定）。服务器看到这个 ID，就应该知道“哦，他刚才收到第 500 个字了”，然后从第 501 个字开始继续推流，而不是从头开始回答。

- **使用 fetch 情求加自封装情求重连或直接用第三方库(fetch-event-source)**

- **多轮对话的时候 模型上下文丢失如何优化**

- **聊天框让 ai 返回 md 格式文档，echarts 表格布局**

**如何实现中断 AI 响应？**

- 使用 AbortController 中断 fetch
- 关闭 SSE 连接
- 状态置为完成

**一些细节**：维护机器人消息的 id，需要用 useref 存储，因为获取消息的函数是异步的，异步代码中就存在一个闭包的问题，它里面可能会获取到旧值，为啥不用 useState，虽然可以用 setState 里面获取到上一次的值处理，但是这个 id 是不变的不需要频繁的更新他，所以这里最好用 useRef

还有就是防止并发请求，也是用 useRef 维护一个值，初始为 false 表示没有请求正在进行，然后请求的开始的时候把这个值设置为 true，

## ai 实训平台的 token 处理(经典 SPA 模式)

1. **登录与存储**：
   - 用户在登录页（`src/app/register/components/RegisterForm.jsx`）提交表单。
   - `handleFinish` 函数被调用，它使用 `apiClient.post` 请求 `/api/user/login` 接口。
   - 如果登录成功，后端**在响应体（JSON 数据）中**返回 `access_token` 和 `dify_token`。
   - 您的 `authStore.login` 方法被调用，它将这个 `access_token` 存储到 **localStorage** 中，并同时更新 MobX 的 state (`this.isLoggedIn = true`)。
2. **请求时携带 Token**：
   - 您的 `src/lib/apiClient.js` 文件中注册了一个**请求拦截器** (`addRequestInterceptor`)。
   - 这个拦截器会在**每一次 API 请求发送前**自动执行。
   - 它的任务是从 `localStorage.getItem("authToken")` 读取 Token。
   - 如果 Token 存在，它会将其添加到请求头（Headers）中：`Authorization: Bearer ${tokenFromStorage}`。
3. **应用加载时恢复登录**：
   - 当用户刷新页面时，`src/app/layout.jsx` 会加载 `AuthStore`。
   - `AuthStore` 的 `initializeAuth` 方法会运行，它会去 `localStorage` 检查 "authToken" 是否存在。
   - 如果存在，它会立刻尝试调用 `/api/user/get_user_info`。
   - 如果这个请求成功（因为 `apiClient` 自动携带了 Token），则确认登录有效，设置 `this.isLoggedIn = true` 并拉取用户信息。如果失败（比如 Token 过期了），则调用 `this.logout()`。

---

### 如何知道用户有没有权限

1. **客户端的前置检查（UI 层面）**：
   - 这是主动防御。您的组件（如 `src/components/Navigation.jsx`）会观察 `authStore.isLoggedIn` 的状态。
   - 如果 `isLoggedIn` 为 `false`，导航按钮会直接被设置为 `disabled`。
   - **优点**：用户界面（UI）响应及时，用户甚至没有机会点击一个他无权访问的按钮。
2. **服务端的拒绝响应（API 层面）**：
   - 这是真正的权限关卡。如果用户未登录（`localStorage` 中没有 Token）或者 Token 已经过期，但他们仍然尝试调用一个需要权限的 API（比如直接访问某个页面触发了 `useEffect` 中的 API 请求）：
   - 您的 `apiClient` 会发送请求（此时可能没有 `Authorization` 头，或者头信息是过期的）。
   - 后端服务器会检查 `Authorization` 头。发现无效或缺失，会拒绝请求，并返回一个 **HTTP 状态码，通常是 401 Unauthorized**。
   - 您的 `apiClient.js` 中的 `request` 函数会检查 `if (!response.ok)`，发现响应状态不是 2xx。
   - 它会抛出一个 `HttpError`。
   - 在您的 `AuthStore.js` 中（比如 `initializeAuth` 或 `refreshUserInfo`），`try...catch` 块会捕获这个 `HttpError`。如果发现 `error.status === 401`，它就会调用 `this.logout()`，清空本地状态和 `localStorage`，强制用户回到未登录状态。

---

### Next.js 的做法(Server-Centric 模式)

Next.js（特别是 App Router）推崇一种更安全、更强大的**以服务端为中心的认证模式**。

- **核心区别**：不使用 `localStorage`，而是使用 **httpOnly Cookie**。
- **登录**：用户提交登录表单。后端 API 收到请求并验证通过后，**不**在 JSON 响应体中返回 Token。相反，它在响应头中设置一个 `Set-Cookie`，例如： `Set-Cookie: authToken=...; HttpOnly; Secure; SameSite=Strict; Path=/`
- **什么是 httpOnly？**：这意味着这个 Cookie **不能被任何客户端 JavaScript 访问**（即 `document.cookie` 看不到它）。这能极大地防止 XSS 攻击者窃取 Token。
- **请求**：浏览器在后续向**同域名**发送的**所有请求**中，都会**自动**携带这个 `httpOnly` Cookie。您的 `apiClient` 不再需要任何请求拦截器来手动添加 `Authorization` 头。
- **权限判断**：
  1. **在服务端组件（RSC）中**：Next.js 的 Server Components 可以直接在服务端运行。它们可以读取请求中的 Cookie，判断用户是否登录，然后再决定是否渲染页面或获取数据。
  2. **在 Middleware 中**：这是 Next.js 最强大的功能之一。您可以在 `src/middleware.js` 文件中编写一个函数。这个函数会在**所有**（或您指定的 `matcher` 匹配的）路由被访问**之前**在服务器上运行。
     - 它可以检查请求中是否存在 `httpOnly` 的 `authToken` Cookie。
     - 如果 Cookie 不存在，它可以**直接将用户重定向**到登录页面，用户甚至永远不会看到受保护页面的内容。

---

### 如何将 "Next.js 的做法" 融合到您的项目

1. **后端 API 修改 (最重要)**
   - 修改您的 `/api/user/login` 接口。当登录成功时，不再返回 `access_token`。
   - 改为在响应头中设置 `httpOnly` Cookie。
   - 创建一个 `/api/user/logout` 接口，该接口的唯一作用是返回一个清除 `authToken` Cookie 的响应头。
2. **src/lib/apiClient.js 修改**
   - **移除** `addRequestInterceptor` 中从 `localStorage` 读取并设置 `Authorization` 头的整段逻辑。
   - （如果您的 API 和 Next.js 应用不在同一个子域下）在 `fetch` 的 `options` 中添加 `credentials: 'include'`，以确保浏览器在跨域请求时也会发送 Cookie。
3. **src/stores/AuthStores.js 修改**
   - **login 方法**：不再需要接收 `accessToken` 和 `difyToken`（如果 `difyToken` 也改用 Cookie）。它只需要在 API 调用成功后，设置 `isLoggedIn = true`，然后调用 `refreshUserInfo` (或 `initializeAuth`) 来获取用户信息。
   - **logout 方法**：在清空 MobX 状态之前，**必须**先 `await apiClient.post('/api/user/logout')` 来通知后端清除 `httpOnly` Cookie。同时移除 `localStorage.removeItem`。
   - **initializeAuth 方法**：这是变化最大的地方。
     - **移除**所有 `localStorage.getItem` 的逻辑。
     - 它的唯一工作就是：`this.setLoading(true)`，然后直接尝试调用 `apiClient.get("/api/user/get_user_info")`。
     - **如果成功**：说明浏览器自动发送了有效的 `httpOnly` Cookie，后端验证通过。此时 `runInAction` 设置 `this.userInfo` 和 `this.isLoggedIn = true`。
     - **如果失败 (catch 到 401)**：说明没有 Cookie 或 Cookie 无效，调用 `this.logout(false)` (确保不再次调用 `localStorage.removeItem`)。
4. **(推荐) 增加 src/middleware.js**
   - 在您的 `src/` 目录下创建一个新文件 `middleware.js`。
   - 在里面，您可以定义哪些路由是受保护的（比如 `/modelWorkbench` 和 `/personalCenter`）。
   - `middleware` 会检查请求中是否有 `authToken` Cookie。如果没有，它会直接返回一个重定向响应，将用户踢到登录页面。

**融合后的好处：**

- **更安全**：`httpOnly` Cookie 无法被 JS 窃取。
- **更优雅**：`apiClient` 变得更干净，不再需要手动管理 Token 注入。
- **服务端保护**：`middleware` 提供了真正的路由级保护，而不是像现在这样仅仅在客户端隐藏/禁用 UI 元素。

希望这个分析对您有帮助！您想先从哪一步开始讨论修改呢？例如，我们可以先看看如何修改 `AuthStore.js` 的 `initializeAuth` 方法。

### 拦截器

**拦截器注册表 (一个数组)**

- 在 `apiClient.js` 文件的顶部，定义了一个全局数组 `requestInterceptors = []`。
- 文件还导出了一个函数 `export function addRequestInterceptor(fn)`，任何其他文件都可以调用这个函数，将一个自定义的函数（即一个“拦截器”）添加到 `requestInterceptors` 数组中。

**拦截器执行 (在核心请求函数中)**

- 在 `apiClient.js` 文件的核心 `request` 函数中，**在真正发起 fetch 请求之前**，它会使用一个 `for...of` 循环来遍历 `requestInterceptors` 数组。
- 它会执行（`await`）数组中的每一个拦截器函数，并把当前的请求配置对象（`currentOptions`）传递给它。
- 拦截器函数会修改这个 `currentOptions` 对象（比如添加请求头），然后再将其返回，传递给下一个拦截器或最终的 `fetch` 调用。

**您的 Token 拦截器 (具体实现)**

- 在 `apiClient.js` 文件的底部，它立即调用了 `addRequestInterceptor` 注册了一个默认的拦截器。这就是您关心的 Token 注入逻辑。
- 这个拦截器的实现步骤是：
  - a. 从 `localStorage.getItem("authToken")` 读取 Token。
  - b. 检查 Token 是否存在 (`if (tokenFromStorage)`)。
  - c. 确保 `config.headers` 是一个可写的 `Headers` 对象。
  - d. 检查是否**尚未**存在 `Authorization` 请求头 (`if (!headers.has("Authorization"))`)。
  - e. 如果不存在，它会检查 Token 是否已包含 "Bearer " 前缀，如果不包含，则手动添加，然后设置 `headers.set("Authorization", authorizationValue)`。
  - f. 返回被修改后的 `config` 对象。
