# 常见场景题

## ECharts 的“0 秒无感刷新”

要实现 ECharts 的“0 秒无感刷新”只需在 useEffect 中启动一个定时器（setInterval），用它定期轮询 API 获取最新数据，然后直接调用 ECharts 实例的 setOption 方法，不带第二个参数（或者设为 false）。ECharts 就会自动“合并”新旧数据并平滑地更新图表，而不会产生闪烁。
如果数据量很大，这种方法就不适用了

## SSE 大屏实时化方案

- **它是什么：** SSE 是一种**单向**的通信协议，允许服务器**主动地**将数据“推送”到客户端（浏览器）。
- **它与 Polling (轮询) 的区别：**
  - **轮询 (Pull)：** 客户端每 5 秒问一次“有新数据吗？”，99% 的时间服务器都在回答“没有”。
  - **SSE (Push)：** 客户端建立一个“长连接”，告诉服务器：“有新数据了再叫我”。服务器只在**有数据时**才推送，**没有**任何浪费的请求。
- **它与 WebSockets 的区别：**
  - **WebSockets：** **双向**通信。客户端可以“推”，服务器也可以“推”。这对于“聊天室”是必须的。
  - **SSE：** **单向**通信（服务器 -> 客户端）。这对于“大屏”（只负责*展示*数据）来说，功能不多不少，**刚刚好**，而且开销更小。

---

### 工作机制：

要实现 SSE，客户端和服务器必须“串通”，它分为两部分：

#### A. 客户端 (大屏) - “订阅者”

客户端的工作**极其简单**，这是 SSE 最大的优势之一。

1. **关键 API：EventSource**
   - 我们在 `useEffect` (的 `mount` 阶段) 中，创建**一个** `EventSource` 实例，指向一个特定的后端 API（比如 `/api/dashboard-stream`）。
2. **监听消息：.onmessage**
   - 我们为这个 `EventSource` 实例绑定一个 `.onmessage` 事件监听器。
3. **接收数据**
   - **当且仅当**服务器推送了新数据，这个 `.onmessage` 事件**才会触发**。
   - 我们从 `event.data` 属性中拿到“数据”（通常是 JSON 字符串），然后 `JSON.parse`。
4. **更新状态**
   - 我们用这个新数据去 `setState`（或更新 React 19 的 `useOptimistic` 等）。
5. **ECharts 更新**
   - ECharts 组件（或任何其他图表库）监听到 state 变化，自动调用 `setOption` 更新视图。
   - **(重点)** ECharts 的“0 秒无感刷新”（`setOption` 合并）这个优点**被保留**了。

#### B. 服务端 - “推送者”

服务端的工作是 SSE 的**核心**。

1. **特定的 API 终结点 (Endpoint)**
   - 那个 `/api/dashboard-stream` 接口**不能**是一个普通的 API。
   - 它**不能**在收到请求后立刻 `res.json()` 并关闭连接。
2. **特殊的“响应头” (Headers)**
   - 服务器**必须**发送一个特殊的 `Content-Type` 响应头： `Content-Type: text/event-stream`
   - 这就是告诉浏览器：“注意，这不是一次性数据，这是一个‘流’，请保持连接！”
   - 服务器还必须发送 `Cache-Control: no-cache` 和 `Connection: keep-alive`。
3. **“保持连接” (Long-lived Connection)**
   - 服务器**必须“挂起”**这个 HTTP 连接，**不能**关闭它。
4. **“推送”数据 (The Push)**
   - 当后端（比如数据库、Kafka、Redis 消息队列）**真的**有了新数据...
   - 服务器**立即**通过这个“挂起”的连接，`res.write()` 一个**特定格式**的纯文本字符串。
   - **SSE 格式：** `data: {"chart_id": "A", "value": 123}\n\n`
   - (注意：必须是 `data:` 开头，必须是 `\n\n` 结尾)。

---

### 为什么 SSE 特别适合“大屏”？

1. **真实时，零浪费**
   - 解决了 `setInterval` 的**所有缺陷**。没有浪费的请求，服务器只在需要时才工作，客户端 CPU 占用极低。
2. **自动重连**
   - 这是 SSE **秒杀** WebSocket 的地方（在“大屏”场景下）。
   - “大屏”通常会 24/7 运行。如果网络**闪断**了一下...
   - **WebSocket：** 连接会断开，你**必须**自己写复杂的“心跳检测”和“重连”逻辑。
   - **SSE (EventSource)：** 浏览器**内置**了“自动重连”机制。如果连接断开，`EventSource` 会**自动**（在几秒后）尝试重新连接，直到成功。

### 注意

- **数据格式：** SSE 只能传输**纯文本**。这意味着所有复杂对象（JSON）都**必须**在服务器端 `JSON.stringify`，并在客户端 `JSON.parse`。
- **连接数限制：** 浏览器对 `EventSource` 的**并发连接数**有限制（比如一个域名下最多 6 个）。这对于“大屏”通常不是问题，因为一个“大屏”页面通常只需要一个“主数据流”。
- **代理/防火墙：** `SSE` 是一种“长连接”。中间的 Nginx 代理或防火墙**必须**被正确配置，允许 `keep-alive`，并且**不能**“缓冲 (buffer)” `text/event-stream` 的响应，否则客户端会收不到数据。

## ai 实训平台-SSE (Server-Sent Events) 的实现与管理

- **概述**：
  与 ai 对话的时候，由于大模型需要时间来思考，如果要让大模型一下输出所有答案的话需要经历长时间的等待，用户体验不好，所以有了 sse 流式输出，就是将一个完整的 sse 事件割到多个数据块中，然后把所有解码后的字符串拼在一个大字符串里面，这个字符串可以称为缓冲区，起到缓冲的作用，检查这个结果中是否有分隔符，这个分隔符就是用来分割要展示的部分，如果你第一次要展示 a，第二次展示 b 那 a 和 b 之间就会有分隔符，如果有分隔符 `\n\n`。如果有分隔符就说明有一个完整事件，然后逐个渲染完整的事件字符串，把已经渲染的部分从缓冲区移出去，通过一个结束的标志 `data: [DONE]`决定整条回答是否结束

  在请求头中设置了 `Accept: 'text/event-stream'`，返回的是一个响应流通过 `response.body.getReader()` 获取流的读取器（reader）。然后在一个循环中不断调用 `reader.read()` 来读取数据块。

- **实现**:
  我在 `useChatAPI` 这个自定义 Hook 中封装了 SSE 的处理逻辑。通过 `fetch` API 发起流式请求（利用了 `apiClient.js` 中封装的 `postStream` 方法），然后使用 `response.body.getReader()` 和 `TextDecoder` 来逐步读取流数据。为了应对网络传输中数据块可能被分割的情况，我维护了一个缓冲区 (`buffer`)，累积接收到的数据，直到遇到 SSE 事件的分隔符 (`\n\n`) 才进行处理。解析时需要剥离 `data:` 前缀，处理 JSON 解析可能出现的异常，并特别识别流结束的标志 `[DONE]`。

- **状态更新**:
  在流式接收过程中，需要实时更新聊天界面的消息状态 (`setMessagesState`)，将接收到的文本片段累加到对应的机器人消息上，并展示加载（打字）动画。这里使用了 `useRef` (如 `currentBotMessageIdRef`) 来确保在异步回调中能正确地更新对应的消息气泡。

**错误处理**: SSE 的错误处理比较复杂。不仅要处理请求发起时的 HTTP 错误，还要处理流传输过程中可能出现的错误（比如后端模型报错并通过流返回错误信息）。我增加了逻辑来检测流数据中的错误标识，并在 UI 上将对应的消息标记为错误状态，同时确保在流结束或出错时正确释放读取器 (`reader.releaseLock()`) 并清理状态。

**SSE 错误处理，内置了自动重连。**

- **发生的情况**：
  1. 你正在接收 AI 的流式回答。
  2. 你突然走进了电梯，网络断了。
  3. `EventSource` 对象会监听到连接中断 (触发 `onerror` 事件)。
  4. 此时，它**会自动**进入重连模式。
  5. 它会每隔几秒钟（这个时间可以由服务器通过 `retry:` 字段指定，默认约 3 秒）**自动尝试重新向原来的 URL 发起连接**。
  6. 当你走出电梯，网络恢复了，它下一次重连尝试就会成功，然后继续接收数据流。
- **需要后端配合**： 这种自动重连也需要后端设计配合。后端需要知道你是“断线重连”的，还是“发起新提问”的。 通常，浏览器重连时会发送一个特殊的 HTTP 头 `Last-Event-ID`（这个 ID 可以由服务器在上一条消息中用 `id: ...` 字段指定）。服务器看到这个 ID，就应该知道“哦，他刚才收到第 500 个字了”，然后从第 501 个字开始继续推流，而不是从头开始回答。

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

## 结合 ai 实训平台谈谈路由拦截（nextjs 模式）

1. **您的项目中目前有没有路由拦截？** **答：** 您的项目目前**没有**真正意义上的“路由拦截”（Route Interception）或“路由守卫”（Route Guard）。

2. **那您的项目是如何防止未授权访问的？** 您的项目目前依赖两层“保护”，这是一种非常典型的纯客户端 SPA（单页应用）的实现方式：

   - **第 1 层：UI 层的“导航守卫” (在 Navigation.jsx 中)**
     - **原理：** 您的 `Navigation` 组件 会从 `authStore` 侦听 `isLoggedIn` 状态。如果用户未登录 (`!isLoggedIn`)，它会直接给“模型工作台”和“智能体工作台”等链接对应的 `GradientButton` 组件传递 `disabled={true}` 属性。
     - **优点：** 界面响应非常快，用户能立刻看到自己无权访问某些区域。
     - **缺点：** 这**极其不安全**。这只是“隐藏了门把手”，但门没有锁。如果用户知道 URL（例如，直接在浏览器地址栏输入 `/modelWorkbench/modelTrain`），他可以**完全绕过**这个 UI 守卫并直接访问页面。
   - **第 2 层：API 层的“数据守卫” (在 apiClient.js 和 AuthStores.js 中)**
     - **原理：** 这是您的**实际安全防线**。当用户（如上所述）绕过 UI 守卫直接访问 `/modelWorkbench/modelTrain` 页面时：
       1. `modelTrain/page.jsx` 组件会加载。
       2. 它的 `useEffect` 会调用 `getData()` 来获取数据。
       3. `getData()` 使用 `apiClient` 发起请求。
       4. 您的 `apiClient.js` 中的**请求拦截器** 会尝试从 `localStorage` 读取 "authToken"。
       5. 由于用户未登录，`localStorage` 中没有 Token。
       6. 后端 API 收到一个没有 `Authorization` 头的请求，并返回 **401 Unauthorized** 错误。
       7. 您的 `AuthStore.js` 在 `initializeAuth` 或 `refreshUserInfo` 的 `catch` 块中捕获到这个 401 错误，并调用 `this.logout()`。
       8. `logout()` 会清空状态，`isLoggedIn` 变为 `false`，`layout.jsx` 监听到变化，将顶部的 `PersonalCenter` 切换为“登录/注册”按钮，从而在*事实上*将用户“踢”出了登录状态。
     - **优点：** 提供了真正的安全兜底，未授权的 API 请求绝对不会成功。
     - **缺点：** **用户体验极差**。用户会先加载一个（可能是空的或显示加载中的）受保护页面，然后数据请求失败，最后 UI 才响应并“跳”回到未登录状态。这就是所谓的“页面闪烁”。

3. **Next.js 的推荐方法**：中间件 (Middleware)

   Next.js 推荐使用**中间件（Middleware）** 来实现真正、安全的路由拦截。这是在服务器端执行的，远在客户端 JavaScript 加载之前。

   - **原理：**

     1. 您需要在您的 `src/` 目录下创建一个文件，命名为 `middleware.js` (或 `.ts`)。

     2. 在这个文件中，您可以导出一个 `config` 对象，其中包含一个 `matcher` 数组，用来定义哪些路由需要被这个中间件“拦截”。

        ```JavaScript
        export const config = {
          matcher: [
            '/modelWorkbench/:path*', // 拦截所有模型工作台的子路由
            '/personalCenter',       // 拦截个人中心
            // ... 其他需要登录的路由
          ],
        };
        ```

     3. 然后，您导出一个 `middleware(request)` 函数。这个函数会在**服务器上**（在边缘网络）运行，**在您的页面（Page）或布局（Layout）开始渲染之前**。

     4. 在这个函数中，您可以检查请求中的 **Cookie**（Next.js 推荐使用 `httpOnly` Cookie 存储 Token，而不是 `localStorage`）。

   - **优点 (相比您当前的方法)：**

     - **绝对安全：** 拦截发生在服务器端。未授权的用户**永远不会**收到受保护页面的任何 HTML 或 JavaScript。
     - **无闪烁：** 用户会被立即、干净地重定向到登录页，根本没有机会看到受保护页面的布局。
     - **集中管理：** 所有受保护的路由都在 `matcher` 中统一定义，而不是分散在各个组件的 `disabled` 属性中。
     - **兼容 httpOnly Cookie：** 这是最安全的存储 Token 方式，因为它无法被客户端的 JavaScript（XSS 攻击）读取，但中间件在服务器上可以读取它
