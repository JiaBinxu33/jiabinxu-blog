# nextjs - 15 版本及以上

## 介绍

nextjs 官网：https://nextjs.org/docs/getting-started
Next.js 是一个 React 框架，它允许你使用 React 框架建立超强的、有利于 SEO 的、极度面向用户的静态网站和网络应用。Next.js 以在构建具有你所需要的所有功能的生产就绪的应用程序时的最佳开发者体验而闻名。

它具有混合静态和服务器渲染、TypeScript 支持、智能捆绑、路由预取等功能，无需额外配置。

**环境准备**

- Node.js 18+
- npm/yarn/pnpm（推荐使用 pnpm）
- 代码编辑器（推荐 VS Code）

## 项目搭建

```bash
$ npx create-next-app

# 若还未安装 create-next-app ，则需要先安装以下软件包:
Need to install the following packages:
  create-next-app
Ok to proceed? (y) y

# 项目名称
√ What is your project named? ... my-app

# 是否需要使用 TypeScript
√ Would you like to use TypeScript? ... No / Yes ✔

# 是否需要使用 ESLint
√ Would you like to use ESLint? ... No / Yes ✔

# 是否需要使用 Tailwind CSS（https://www.tailwindcss.cn/）只需书写 HTML 代码，无需书写 CSS
# 本质上是一个工具集，包含了大量类似 flex、 pt-4、 text-center 以及 rotate-90 等工具类，可以组合使用并直接在 HTML 代码上实现任何 UI 设计。
√ Would you like to use Tailwind CSS? ... No / Yes ✔

# 是否需要在项目中使用 src 目录，若不使用 src 目录默认会把所有文件放在根目录，为了方便开发，这里启用 src 目录
√ Would you like to use `src/` directory? ... No / Yes ✔

# 是否使用 App Router，若选择 No 则默认是 Pages Router（具体区别在下面，可以先简单看下再选择）
√ Would you like to use App Router? (recommended) ... No ✔ / Yes

# 是否启用路径别名
√ Would you like to customize the default import alias? ... No / Yes ✔

# 希望配置什么导入别名（默认是 @/*，若不修改默认别名则直接回车）
√ What import alias would you like configured? ... @/*

# 完成配置选择后，下面工具将会根据上述配置进行项目搭建
Creating a new Next.js app in E:\xxx\my-app.

Using npm.
# 若上述选择了 App Router 则模板初始化项目为 app-tw，若没选择则模板初始化项目为 default-tw
#（下面会展示对应模板的初始化目录）
Initializing project with template: default-tw


Installing dependencies:
- react
- react-dom
- next
- typescript
- @types/react
- @types/node
- @types/react-dom
- tailwindcss
- postcss
- autoprefixer
- eslint
- eslint-config-next


added 326 packages, and audited 327 packages in 2m

117 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Initialized a git repository.

Success! Created my-app at E:\xxx\my-app

```

### 项目目录结构

```
├── src/
│   ├── app/                # App Router 核心目录
│   │   ├── layout.tsx      # 全局布局
│   │   └── page.tsx        # 首页组件
│   ├── components/         # 公共组件
│   ├── lib/                # 工具函数/第三方库
│   └── styles/             # 全局样式
├── public/                 # 静态资源
├── next.config.js          # Next.js 配置
└── package.json
```

## Node.js 与前端项目中的环境变量（env）笔记

1. 环境变量的作用

   - 环境变量（Environment Variables，简称 env）用于存储应用运行时的配置信息，如数据库连接、API 密钥、运行模式（开发/生产）、第三方服务凭证等。
   - 通过环境变量，可以将敏感或易变的信息与代码分离，提升安全性与灵活性。
   - 常见使用场景：数据库 URL、API Token、不同环境下的配置切换（如开发、测试、生产）。

2. 环境变量的定义与使用方式

   - 一般通过 `.env` 文件定义环境变量，格式为 `KEY=VALUE`。
   - 在 Node.js、Next.js、Vite 等现代前端/全栈框架中，官方都内置了环境变量管理机制。

   **示例：.env 文件内容**

   ```
   # .env
   DATABASE_URL=postgres://user:pass@localhost:5432/mydb
   NEXT_PUBLIC_API_BASE=https://api.example.com
   SECRET_KEY=xxxxx
   NODE_ENV=development
   ```

3. Node.js 项目中如何读取环境变量

   - Node.js 通过 `process.env` 读取环境变量。

   **示例代码：**

   ```js
   // 读取环境变量
   const dbUrl = process.env.DATABASE_URL;
   const secret = process.env.SECRET_KEY;
   ```

4. Next.js、Vite 等前端框架中的环境变量

   - 约定以 `NEXT_PUBLIC_`（Next.js）或 `VITE_`（Vite）为前缀的变量自动暴露到浏览器端。**不要把敏感信息暴露给前端！**
   - 其余变量只在服务端可用，保证安全性。

   **Next.js 示例：**

   ```js
   // 服务端可读取所有变量
   const dbUrl = process.env.DATABASE_URL;
   // 客户端只能读取 NEXT_PUBLIC_ 前缀的变量
   const apiBase = process.env.NEXT_PUBLIC_API_BASE;
   ```

   **Vite 示例：**

   ```js
   // 只能读取以 VITE_ 为前缀的变量
   const baseUrl = import.meta.env.VITE_API_BASE;
   ```

5. .env 文件的种类和优先级

   - 常见文件有 `.env`、`.env.local`、`.env.development`、`.env.production` 等。
   - 优先级：本地优先（如 `.env.local` 覆盖 `.env`），可根据环境自动切换不同配置。
   - 生产环境建议通过运维/CI/CD 系统设置环境变量，不要直接上传 .env 文件。

6. 环境变量的安全与最佳实践

   - **敏感信息（如密码、密钥）只放在服务端可用的变量，不要加 NEXT*PUBLIC*/VITE\_ 前缀。**
   - `.env` 文件一般加入 `.gitignore`，防止泄露敏感信息到代码仓库。
   - 生产环境推荐用云服务、CI/CD、服务器环境配置方式设置变量。

7. 环境变量的类型和默认值

   - 环境变量默认都是字符串类型。取值时注意转换。
   - 可以通过代码设定默认值，防止变量未定义导致程序报错。

   **示例：设置默认值**

   ```js
   const port = process.env.PORT || 3000;
   ```

8. 参考
   - [Node.js 官方文档：process.env](https://nodejs.org/api/process.html#processenv)
   - [Next.js 官方文档：环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
   - [Vite 官方文档：环境变量](https://vitejs.dev/guide/env-and-mode.html)

## 为项目添加可使用@引入

通常情况可在创建项目时加入，如果未集成，可以手动加入配置

- 修改 next.config.mjs

  ```
  import path from "path";
  import { fileURLToPath } from "url";

  // 获取 ESM 的 __dirname 等效值
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  export default {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        //路径映射
        "@": path.resolve(__dirname, "src"),
      };
      return config;
    },
  };

  ```

- 配置 jsconfig.json/tsconfig.json

  ```
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
      // 注意，这里不需要单独为每个文件配置路径，直接配置根路径，根路径下所有子文件夹都可以被访问到
        // "@components/*": ["src/components/*"],
        "@/*": ["src/*"]
      }
    }
  }
  ```

- 注意事项

  - jsconfig.json 中
    不需要单独为每个文件配置路径，直接配置根路径，根路径下所有子文件夹都可以被访问到
  - 组件中使用：@/xxx，注意斜杠，要使用@/，不是只有@，根据 jsconfig.json 中的配置作为判断依据

## Next.js 核心渲染概念

Next.js 提供了多种灵活的渲染策略，以满足不同应用场景，优化性能、SEO 和用户体验。以下内容结合 Next.js 官方文档和社区权威资料详细介绍了主要的渲染机制。

---

**1. 静态渲染（Static Rendering）**

**核心思想**：在构建时（build time）生成 HTML 文件，用户访问时直接返回静态文件。

- **实现方式**：Next.js 默认采用静态渲染，如果页面没有动态依赖（如 cookies、headers、搜索参数），会自动在构建阶段生成 HTML 文件。
- **优势**：
  - 速度极快：内容可部署到 CDN，用户可从最近节点读取页面，极大提升加载速度。
  - 服务器压力低：页面仅需在构建阶段生成一次，后续请求无需服务器实时参与。
  - SEO 友好：搜索引擎抓取到完整 HTML 内容。
- **适用场景**：博客、产品介绍页、公司官网等内容不常变且对所有用户一致的页面。

参考：[Partial Prerendering - Next.js 官方文档](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)

---

**2. 动态渲染（Dynamic Rendering）**

**核心思想**：在请求时（request time）由服务器实时生成页面 HTML，允许页面内容根据每次请求个性化变化。

- **实现方式**：如果页面依赖 cookies、headers、实时数据等，Next.js 会自动切换为动态渲染。
- **优势**：
  - 数据实时：可展示每次请求的最新数据（如用户仪表盘、新闻流）。
  - 内容个性化：支持为不同用户渲染不同内容。
- **适用场景**：需要展示个性化或实时数据的页面，如个人中心、购物车、社交动态等。

参考：[Dynamic rendering instead of Static rendering (StackOverflow)](https://stackoverflow.com/questions/77368815/next-js-13-dynamic-rendering-instead-of-static-rendering)

---

**3. 组件级流式传输（Component-Level Streaming）**

**核心思想**：利用 React 18 的 `<Suspense>` 组件，允许页面的部分内容（如慢速数据组件）异步流式加载，页面其余部分可先渲染并展示。

- **实现方式**：
  1. 找出页面中数据加载较慢的组件（如需要复杂数据查询的图表）。
  2. 让该组件自身异步获取数据（使用 async/await）。
  3. 在父组件中使用 `<Suspense fallback={<Skeleton />}>` 包裹慢组件，未加载前显示骨架屏。
- **优势**：
  - 用户体验优：页面静态部分可快速可见，大幅缩短首屏时间。
  - 可渐进增强：慢组件加载完毕后无缝“流入”页面。
- **适用场景**：含有部分慢数据加载、希望优化首屏体验的复杂页面。
- **决定 Suspense 的边界在哪里**：
  - Suspense 的界限取决于以下几点：
    1. 您希望用户如何体验页面流动。
    2. 您想要优先考虑哪些内容。
    3. 如果组件依赖于数据获取。
  - 你可以整体流式传输页面，也可以只流式某些组件，具体看业务需求。

参考：[Understanding rendering in Next.js - Educative](https://www.educative.io/answers/understanding-rendering-in-nextjs)

---

**4. 部分预渲染（Partial Prerendering，PPR）**

**核心思想**：结合静态与动态渲染的优点。Next.js 先为页面生成静态“壳”，动态内容部分预留“漏洞”（Holes），动态数据随后异步流入。

- **工作原理**：
  1. Next.js 预渲染静态框架（如布局、通用组件）。
  2. 页面上的动态内容部分以“漏洞”形式留空，待请求时异步填充。
  3. 用户可立刻看到静态内容，动态内容加载完成后自动补全。
- **优势**：
  - 兼顾速度与实时性：首屏极快可见，个性化/实时内容随后补全。
  - SEO 友好：静态壳提升可抓取性，动态内容可按需加载。
- **适用场景**：既有静态内容又有个性化/实时内容的页面，如电商首页、社交信息流等。
- **状态演进**：
  - Next.js 14：PPR 为实验性功能，需 canary 版本并在配置中手动开启。
  - Next.js 15：PPR 已为稳定特性，默认开启，无需额外配置。

参考：

- [Getting Started: Partial Prerendering - Next.js 官方文档](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
- [Next.js Rendering Strategies and how they affect core web vitals](https://nextjs.org/docs/app/building-your-application/rendering)

---

**5. 术语对比总结**

| 渲染策略          | 生成时机 | 是否个性化 | 性能     | SEO | 典型场景           |
| ----------------- | -------- | ---------- | -------- | --- | ------------------ |
| 静态渲染          | 构建时   | 否         | 极快     | 优  | 博客、产品介绍页   |
| 动态渲染          | 请求时   | 支持       | 较慢     | 优  | 用户仪表盘、购物车 |
| 组件级流式传输    | 请求时   | 支持       | 渐进提升 | 优  | 慢组件的复杂页面   |
| 部分预渲染（PPR） | 混合     | 支持       | 极快+优  | 优  | 电商、社交信息流   |

---

**参考**

- [Next.js 官方文档：Partial Prerendering](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
- [Next.js Rendering Strategies and how they affect core web vitals](https://nextjs.org/docs/app/building-your-application/rendering)
- [Understanding rendering in Next.js - Educative](https://www.educative.io/answers/understanding-rendering-in-nextjs)
- [next js 13 Dynamic rendering instead of Static rendering (StackOverflow)](https://stackoverflow.com/questions/77368815/next-js-13-dynamic-rendering-instead-of-static-rendering)

---

## 服务器组件 (RSC) vs 客户端组件 (CC) 核心区别

1. **运行环境 & 能力:**
   - **服务器组件 (RSC - Server Component):**
     - **只在服务端**运行（或在构建时运行）。它的代码**永远不会**被下载到浏览器。
     - **优点:**
       - 可以直接访问后端资源（数据库、文件系统、内部 API）。
       - 可以将大型依赖库保留在服务端，减小客户端 JS 包体积。
       - 天然适合做 SEO 和快速的初始页面加载（发送的是 HTML）。
       - **不能**使用 Hooks (`useState`, `useEffect` 等)。
       - **不能**使用浏览器 API (`window`, `document`, `localStorage` 等)。
       - **不能**添加交互事件 (`onClick`, `onChange` 等)。
     - **默认:** 在 Next.js 的 `app` 目录下，所有组件**默认都是服务器组件**。
   - **客户端组件 (CC - Client Component):**
     - 在服务端预渲染（SSR/SSG），然后 JS 代码会被下载到浏览器，进行“水合”（Hydration），之后完全在浏览器中运行和交互。
     - **优点:**
       - 可以使用所有 React 功能，包括 Hooks (`useState`, `useEffect` 等)。
       - 可以使用浏览器 API。
       - 可以添加交互事件 (`onClick`, `onChange` 等)。
     - **标记:** 必须在文件顶部添加 **"use client";** 指令。
2. **JavaScript 包体积:**
   - RSC **不增加**任何客户端 JavaScript 体积。
   - CC 会将其代码和依赖打包进客户端 JavaScript 文件。

## 服务器组件适用场景

**核心原则:** 在 Next.js App Router 中，组件**默认**就是服务器组件。只有当你需要客户端能力（Hooks、事件、浏览器 API）时，才添加 `"use client"`。

以下场景**非常适合**或**必须**使用服务器组件 (RSC):

1. **直接数据获取 (Data Fetching):**
   - **场景:** 需要在渲染前从数据库、API 或文件系统获取数据的组件。
   - **优势:** 可以在服务端直接 `async/await` 获取数据，避免客户端请求瀑布流，提升初始加载速度。数据获取代码永远不会发送到浏览器。
   - **例子:** 页面 (`page.jsx`) 直接获取文章列表、产品详情等，然后将数据作为 props 传递给子组件（可以是 RSC 或 CC）。
2. **访问后端资源:**
   - **场景:** 需要直接访问只有后端才能访问的资源，如数据库连接、内部服务、环境变量（非 `NEXT_PUBLIC_` 前缀的）、文件系统。
   - **优势:** 安全，敏感逻辑和凭证不会暴露到客户端。
   - **例子:** 读取 CMS 内容、直接查询数据库生成报告摘要、访问内部认证服务。
3. **减少客户端 JavaScript 体积:**
   - **场景:** 组件依赖了大型库，但这些库仅用于服务端渲染（如 Markdown 解析器、日期格式化库的复杂部分、数据处理库）。
   - **优势:** 这些库的代码不会被打包进客户端 JS 文件，显著减小包体积，提升应用性能。
   - **例子:** 服务端渲染 Markdown 内容、服务端生成复杂的图表配置（然后将配置传给客户端图表库）、使用重量级依赖进行数据预处理。
4. **纯展示性或静态内容:**
   - **场景:** 组件只负责展示从 props 接收的数据，本身没有交互逻辑、状态或副作用。
   - **优势:** 没有客户端 JS 负担，渲染速度快。
   - **例子:** 网站的页头 (Header)、页脚 (Footer)、文章内容展示块、静态侧边栏、不带交互的卡片 (Card)。

---

### 更多建议与最佳实践：

- **拥抱默认:** 尽可能让组件保持为服务器组件。只有在确实需要客户端能力时，才添加 `"use client"`。
- **组件下沉 (Move Client Components Down):** 如果一个服务器组件需要渲染一个带交互的部分，不要把整个服务器组件都变成客户端组件。而是将交互部分**提取**成一个独立的客户端组件，然后在服务器组件中导入并渲染它。这就是所谓的“孤岛架构”（Island Architecture）。
- **Props 序列化:** 从服务器组件传递给客户端组件的 props 必须是可序列化的（不能传递函数、Date 对象、Map/Set 等复杂类型，除非你手动处理）。
- **共享组件:** 可以在 RSC 和 CC 之间共享纯展示性、不使用 Hooks 或浏览器 API 的组件。

通过合理划分 RSC 和 CC，可以最大化 Next.js App

## SSR 渲染 vs CSR 渲染

### “正常”的渲染流程 (CSR - Client-Side Rendering)

这通常是我们用 Create React App 或类似工具构建的**纯前端 React 应用**的流程：

1. **浏览器请求：** 浏览器向服务器请求页面。
2. **服务器响应：** 服务器返回一个非常**精简的 HTML 文件**，里面可能只有一个 `<div>` 根节点和一个指向 JavaScript 包（bundle.js）的 `<script>` 标签。
3. **浏览器下载 JS：** 浏览器下载这个巨大的 JavaScript 包。
4. **浏览器执行 JS：** 下载完成后，浏览器执行 JavaScript。React 开始在**客户端**运行。
5. **React 渲染 & 数据获取：** React 根据代码渲染组件，通常会显示一个加载状态（Loading Spinner）。同时，它会在**客户端**发起 API 请求去获取页面所需的数据（比如在 `useEffect` 里 fetch）。
6. **DOM 更新：** 数据获取回来后，React 再次渲染，用真实内容更新 DOM。用户最终看到完整的页面。

**特点：**

- 初始 HTML 非常空。
- 主要渲染工作和数据获取都在**客户端**完成。
- 首次加载较慢（需要下载、解析、执行 JS，再发 API 请求），用户会先看到空白或加载指示器。
- 对 SEO 不太友好（搜索引擎爬虫可能只看到空 HTML）。

---

### Next.js 的 SSR 渲染流程 (Server-Side Rendering)

Next.js（特别是使用 Pages Router 的 `getServerSideProps` 或 App Router 的服务器组件）改变了这个流程：

1. **浏览器请求：** 浏览器向 Next.js 服务器请求页面。
2. **服务器端处理：**
   - Next.js 服务器**在服务端**运行 React 代码来渲染你的页面组件。
   - 如果页面使用了 `getServerSideProps` (Pages Router) 或本身是服务器组件 (App Router)，它会**在服务端**执行这些数据获取逻辑（比如访问数据库或调用内部 API）。
3. **服务器生成 HTML：** 服务器等待数据获取完成，然后**生成包含完整内容和数据的 HTML**。
4. **服务器响应：** 服务器将这个**完整的 HTML** 发送给浏览器。
5. **浏览器渲染 HTML：** 浏览器接收到 HTML 后，可以**立即渲染**出页面的大部分内容。用户很快就能看到页面（First Contentful Paint, FCP 很快）。
6. **浏览器下载 JS & 水合 (Hydration)：** 同时，浏览器在后台下载页面所需的 JavaScript 包。下载完成后，React 在**客户端**再次运行，但这次它不是从头渲染，而是将 JavaScript 逻辑（比如事件监听器 `onClick`）“附加”到已有的 HTML 结构上。这个过程叫做**水合（Hydration）**。
7. **页面可交互：** 水合完成后，页面变得完全可交互。

**特点：**

- 初始 HTML 是**完整的**，包含内容。
- 首次渲染和初始数据获取都在**服务器端**完成。
- 首次加载速度快（用户能更快看到内容），对 SEO 非常友好。
- “水合”过程让页面最终变得可交互。
- 服务器需要承担更多的计算压力。

---

### 总结区别

简单来说：

- **CSR** 是把“半成品”（空壳 HTML + JS）发给浏览器，让浏览器自己组装和获取数据。
- **SSR** 是在服务器上把“成品”（完整 HTML + 数据）做好，直接发给浏览器展示，然后再通过水合把事件注入到静态页面中，让页面有交互能力。

Next.js 的 SSR 主要是为了优化**首屏加载速度**和 **SEO**。

## 我有一些页面不需要用到根布局怎么办？

通常情况下，我们创建页面有一套骨架，大部分页面可以在此之上通用，但是有一些“特立独行”的页面，比如登录页，详情页等等他们并不需要用到根布局 也就是 layout ，这时我们可以使用 nextjs 提供的路由组 (Route Groups) ,最好是在创建项目时就考虑拆分路由组，以免二次修改。

---

1. 什么是路由组？
   定义：路由组是一个特殊的文件夹，其名称被圆括号 () 包裹。

核心规则：路由组的文件夹名会被路由系统忽略，不会出现在最终的 URL 路径中。

示例：
文件路径 `app/(marketing)/about/page.tsx` 在浏览器中对应的 URL 是 `/about`，而不是 `/marketing/about`。

2. 为什么要使用路由组？（两大核心用途）
   路由组的主要价值在于组织和管理路由，它提供了两种非常实用的能力：

- 用途一：创建多套独立的、互不嵌套的布局
  这是路由组最强大的功能。通常情况下，子目录的 layout.tsx 会嵌套在父目录的 layout.tsx 中。路由组可以让你打破这种嵌套关系，创建平行的布局系统。

场景：您的应用需要一个带侧边栏和播放器的“主应用布局”，同时还需要一个只有简单背景的“登录/注册布局”。

解决方案：

将主应用页面（如 dashboard, music）放入一个路由组，例如 (main)，并在这个组里创建复杂的 layout.tsx。

将登录/注册页面放入另一个路由组，例如 (auth)，并在这个组里创建极简的 layout.tsx。

在最顶层的 app/layout.tsx 只保留最基础的 `<html>` 和`<body>`。

文件结构示例：

```
src/app/
├── (main)/ # 主应用组
│ ├── music/
│ │ └── page.tsx # URL: /music
│ └── layout.tsx # ✅ 带侧边栏和播放器的复杂布局
│
├── (auth)/ # 身份验证组
│ ├── login/
│ │ └── page.tsx # URL: /login
│ └── layout.tsx # ✅ 只有居中卡片的极简布局
│
└── layout.tsx # //真正的根布局，只包含<html>和<body>
```

结果：

访问 /music 时，应用的是 (main)/layout.tsx。

访问 /login 时，应用的是 (auth)/layout.tsx。

这两套布局是平级的，(auth) 布局不会被嵌套在 (main) 布局中，完美实现了 UI 隔离。

- 用途二：组织项目文件，保持路由整洁
  有时您只想在文件系统里将相关的页面归类，但又不希望为它们创建一套新的布局。

  场景：您的应用有很多营销相关的页面，如 /about, /contact, /pricing。您希望把它们放在一个文件夹里，但它们都应该使用全局的根布局。

  解决方案：
  创建一个路由组 (marketing)，将这些页面放进去，但不要在这个组里创建 layout.tsx 文件。

  文件结构示例：

  ```
  src/app/
  ├── (marketing)/ # 仅用于组织文件的路由组
  │ ├── about/
  │ │ └── page.tsx # URL: /about
  │ ├── contact/
  │ │ └── page.tsx # URL: /contact
  │ └── pricing/
  │ └── page.tsx # URL: /pricing
  │
  └── layout.tsx # 全局根布局
  ```

  结果：

  访问 /about, /contact, /pricing 时，因为 (marketing) 文件夹内没有自己的 layout.tsx，Next.js 会向上查找，并最终使用最外层的 app/layout.tsx。

  这样既保持了文件结构的整洁，又没有引入不必要的布局层级。

3. 关键点总结
   路由组通过文件夹名加括号 () 来创建。

它的核心特性是不影响最终的 URL 结构。

最大的作用是创建并行的、隔离的布局系统，用于处理像应用主界面和登录页这种完全不同的 UI。

当一个路由组内不包含 layout.tsx 文件时，它就只起到组织文件的作用，其内部页面会沿用父级的布局。

它是组织复杂 Next.js 项目、实现高级布局模式的官方标准方法。

## Next.js Server Component (直接数据库)

1. 官方文档解读

   - [Next.js 数据获取官方文档](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)指出：在 Server Component（服务端组件）里可以直接用数据库驱动（如 [postgres.js](https://github.com/porsager/postgres)）访问数据库，无需专门写 API 层。
   - 传统写法：前端请求 `/api/list` 这样的 API 路径，API 代码里查数据库。
   - Next.js Server Component 新写法：服务端组件里直接查数据库，省掉单独 API 层，代码依然运行在服务端，安全性有保障。

2. Server Component 如何连接数据库

   - 在 Server Component、Route Handler 或 API Route 都可以直接用数据库驱动。
   - 只要代码保证只在服务端运行（如 page.tsx 默认是 Server Component），就可以连数据库。

   **数据库访问示例：**

   ```typescript
   // app/lib/data.ts
   import postgres from "postgres";
   const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

   export async function getInvoices() {
     return await sql`SELECT * FROM invoices`;
   }

   // app/invoices/page.tsx
   import { getInvoices } from "../lib/data";

   export default async function InvoicePage() {
     const invoices = await getInvoices();
     return (
       <ul>
         {invoices.map((inv) => (
           <li key={inv.id}>{inv.amount}</li>
         ))}
       </ul>
     );
   }
   ```

3. 前端如何使用这些服务端数据

   - 页面渲染时，Server Component 查库，服务器生成 HTML 并直接返回，首屏体验极佳。
   - 需要交互、异步、局部刷新时，前端通过 fetch 调用 API Route，后端查库返回数据。

   **使用场景总结：**

   - 首屏渲染、静态内容 → Server Component 直查数据库
   - 用户交互（搜索、分页、表单提交等）→ fetch + API Route

4. Server Component 直查库 vs API Route 的适用场景

   - 页面初次加载、静态内容：推荐用 Server Component 直接查库。
   - 用户操作、异步刷新等：推荐用 fetch + API Route。
   - 实时/轮询需求（如点赞、聊天等）：也推荐用 API Route。

   **对比表：**

   | 场景         | 推荐方式          | 说明         |
   | ------------ | ----------------- | ------------ |
   | 页面初次加载 | Server Component  | 直接查库渲染 |
   | 用户操作     | fetch + API Route | 动态查库     |
   | 实时/轮询    | fetch + API Route | 持续获取数据 |
   | 静态页面     | Server Component  | 只查一次     |

5. 具体例子

   - 搜索/分页/表单提交等需要用户交互：客户端 fetch API 路由，API Route 查库返回。
   - 首页加载数据、静态展示：Server Component 直接查库，渲染进 HTML。

   **示例代码：**

   ```typescript
   // 搜索场景（API Route）
   // app/api/search/route.ts
   import postgres from "postgres";
   const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

   export async function GET(req) {
     const { query } = req.query;
     const res = await sql`SELECT * FROM invoices WHERE customer ILIKE ${
       "%" + query + "%"
     }`;
     return Response.json(res);
   }

   // 客户端 fetch
   fetch("/api/search?query=xxx").then((res) => res.json());

   // 首页首屏（Server Component）
   // app/invoices/page.tsx
   export default async function InvoicePage() {
     const invoices = await getInvoices();
     return (
       <ul>
         {invoices.map((inv) => (
           <li key={inv.id}>{inv.amount}</li>
         ))}
       </ul>
     );
   }
   ```

6. 表单提交如何安全插入数据库

   - 必须通过 API Route 或 Server Action 收集表单数据，服务端再执行 SQL 插入，前端不能直连数据库。
   - 插入/更新/删除操作建议统一在服务端路由/函数中完成，保证安全与一致性。

7. SQL 注入防范建议

   - 使用如 postgres.js 这类现代数据库驱动，采用**参数化查询**自动防注入。
   - 写法：`sql\`SELECT \* FROM users WHERE name = ${name}\``
   - 无论 name 传什么内容，驱动会自动转义，防止 SQL 注入攻击。

   **示例代码：**

   ```typescript
   const name = "张三'; DROP TABLE users; --";
   const rows = await sql`SELECT * FROM users WHERE name = ${name}`;
   // 安全，无注入风险
   ```

8. 最佳实践总结

   - 查询（SELECT）：可直接在 Server Component 里做，页面渲染时查库。
   - 插入/更新/删除：推荐通过 [Server Action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) 或 API Route，实现安全的“提交入口”。
   - 千万不要把“有副作用的操作”（如插入/更新/删除）混在页面渲染逻辑里，以免重复执行。

   - 参考
     - [Next.js 官方文档：数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)
     - [postgres.js 官方文档](https://github.com/porsager/postgres)

## Next.js URL 查询参数结合服务端实现搜索和分页

**1. 三大核心 API 钩子的作用**

- 1.1 useSearchParams

  - **作用**：用于在客户端组件中访问和操作当前 URL 的查询参数（search params）。
  - **典型用法**：获取如 `?query=xxx&page=2` 这样的参数，并据此更新组件数据或 UI。
  - **适用场景**：需要读取或响应 URL 查询参数变化的客户端组件，如搜索框、分页器等。

- 1.2 usePathname

  - **作用**：获取当前页面的路径名（不含查询参数），如 `/dashboard/invoices`。
  - **典型用法**：搭配 useSearchParams，拼接更新后的完整 URL。
  - **适用场景**：需要生成新 URL 或实现前端跳转时，确保路径正确。

- 1.3 useRouter

  - **作用**：提供客户端导航能力，允许在不刷新页面的情况下，编程式地跳转/替换 URL（如使用 replace 或 push 方法）。
  - **典型用法**：用户输入后，动态更新 URL 查询参数，并自动发起页面数据的刷新。
  - **适用场景**：如搜索、分页等用户行为发生后，自动同步 URL，触发相关数据刷新。

---

**2. 为什么要使用 URL 查询参数实现搜索和分页？**

- **URL 可分享可收藏**：用户可以复制/收藏包含当前搜索或分页状态的完整 URL，历史状态易于恢复和分享。
- **服务器端渲染友好**：服务端可以直接根据 URL 参数渲染初始内容，无需依赖客户端状态，使 SSR 更加自然强大。
- **便于统计和分析**：URL 中有参数，便于埋点、分析、追踪用户行为。
- **状态与 UI 同步**：页面刷新、后退/前进、收藏、外链跳转等场景下，状态都能自动恢复。

---

**3. 实现步骤概览**

- 3.1 搜索功能

  1. **捕获输入**：在 `<Search />` 客户端组件中，监听输入框变化。
  2. **更新 URL**：使用 useRouter + usePathname + useSearchParams，构造新的 URL 查询参数（如 `?query=xxx`），调用 replace 方法更新 URL。
  3. **输入与 URL 同步**：通过 `defaultValue={searchParams.get('query')}`，确保输入框内容和 URL 状态一致。
  4. **服务端获取数据**：在服务端组件（如 `<Table />`）中，通过 props 传递的 searchParams 获取查询参数，调用数据库/接口返回匹配数据。

- 3.2 分页功能

  1. **分页参数获取**：通过 useSearchParams 获取当前页码（如 `page=2`），服务端组件据此查询数据。
  2. **生成分页 URL**：分页按钮用 createPageURL 方法，基于当前 searchParams 和 pathname 拼接各分页跳转的完整 URL。
  3. **跳转与数据刷新**：用户点击分页按钮，跳转到带有新页码的 URL；服务端据此返回对应数据。

---

**4. 代码片段说明**

- 搜索组件核心逻辑（/app/ui/search.tsx）

  ```tsx
  "use client";
  import { useSearchParams, usePathname, useRouter } from "next/navigation";
  import { useDebouncedCallback } from "use-debounce";

  export default function Search({ placeholder }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    // 防抖，避免每次输入都发送请求
    const handleSearch = useDebouncedCallback((term) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1"); // 搜索时重置页码
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
      <input
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    );
  }
  ```

- 分页组件核心逻辑（/app/ui/invoices/pagination.tsx）

  ```tsx
  "use client";
  import { usePathname, useSearchParams } from "next/navigation";

  export default function Pagination({ totalPages }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    // 生成跳转到指定页的 URL
    const createPageURL = (pageNumber) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    };

    // ...分页按钮渲染
  }
  ```

---

**5. 何时用 useSearchParams，何时用 searchParams prop？**

- **客户端组件**：如 `<Search />`、`<Pagination />`，用 useSearchParams 读取和响应 URL 参数变化。
- **服务器端组件**：如 `<Table />`，通过页面组件传入的 searchParams prop 获取参数，传递给数据查询逻辑。
- **最佳实践**：客户端钩子只在客户端组件使用，避免不必要的服务端渲染和 hydration。

---

**6. 防抖（Debounce）优化**

- **作用**：防止每次输入都发请求，减少数据库压力。用户停止输入一段时间后才触发查询。
- **实现**：use-debounce 库的 useDebouncedCallback。

---

[参考：Next.js 官方文档：Routing and Navigation](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

---

## Next.js Server Actions

1. Server Actions 的核心概念

   - Server Actions 是 React 和 Next.js 的新特性，允许你在服务端直接写和执行异步操作（如数据库增删改查），**无需单独写 API 路由**。
   - 优势：简化数据变更流程、提升安全性（自动作用于服务端，防止敏感逻辑泄漏到客户端）、更易维护。
   - 关键技术点：加密闭包、严格输入检查、错误哈希等提升安全。

   **示例：定义 Server Action**

   ```tsx
   // app/dashboard/invoices/create/page.tsx
   export default function Page() {
     async function create(formData: FormData) {
       "use server";
       // 这里可以直接访问数据库等服务端资源
       // 比如 await db.insert(...)
     }
     return <form action={create}>...</form>;
   }
   ```

2. 表单与 Server Actions 的集成方式

   - 直接在 `<form>` 的 action 属性中传入 server action 函数。
   - 提交表单时，表单数据（FormData）自动传递给 server action。
   - 即使前端 JS 未加载（如极端弱网或禁用 JS），表单也能正常提交（渐进增强/Progressive Enhancement）。

   **示例：表单 action 绑定 Server Action**

   ```tsx
   function Page() {
     async function create(formData: FormData) {
       "use server";
       // 处理逻辑
     }
     return (
       <form action={create}>
         <input name="name" />
         <button type="submit">提交</button>
       </form>
     );
   }
   ```

3. Server Actions 与缓存的集成

   - Next.js 的 Server Actions 与页面/数据缓存机制（如 ISR、SSG）无缝结合。
   - 提供 `revalidatePath` 和 `revalidateTag` 等 API，允许在数据变更后主动刷新指定页面或标签的缓存，确保用户始终看到最新数据。

   **示例：刷新缓存**

   ```typescript
   import { revalidatePath } from "next/cache";
   import { redirect } from "next/navigation";

   export async function createInvoice(formData: FormData) {
     // ...执行数据库操作
     revalidatePath("/dashboard/invoices"); // 刷新发票列表页面缓存
     redirect("/dashboard/invoices"); // 操作后重定向
   }
   ```

4. 创建发票的完整流程示例

   - 1. 新建路由和表单页面，如 `/dashboard/invoices/create/page.tsx`，表单 action 绑定 `createInvoice`。
   - 2. Server Action 用 `"use server"` 标记，参数类型通常为 `FormData`。
   - 3. 用 `formData.get("字段名")` 获取表单输入，并用 Zod 校验数据和自动类型转换。
   - 4. 数据入库时建议金额用“美分”存储，防止浮点误差。
   - 5. 操作成功后刷新缓存并重定向。

   **示例代码：actions.ts**

   ```typescript
   import { z } from "zod";
   import { revalidatePath } from "next/cache";
   import { redirect } from "next/navigation";
   import postgres from "postgres";

   const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

   const FormSchema = z.object({
     id: z.string(),
     customerId: z.string(),
     amount: z.coerce.number(),
     status: z.enum(["pending", "paid"]),
     date: z.string(),
   });
   const CreateInvoice = FormSchema.omit({ id: true, date: true });

   export async function createInvoice(formData: FormData) {
     const { customerId, amount, status } = CreateInvoice.parse({
       customerId: formData.get("customerId"),
       amount: formData.get("amount"),
       status: formData.get("status"),
     });
     const amountInCents = amount * 100;
     const date = new Date().toISOString().split("T")[0];

     await sql`INSERT INTO invoices (customer_id, amount, status, date)
       VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

     revalidatePath("/dashboard/invoices");
     redirect("/dashboard/invoices");
   }
   ```

5. 动态路由与发票编辑场景

   - 动态路由通过 `[id]` 目录实现，例如 `/dashboard/invoices/[id]/edit/page.tsx`。
   - 页面组件通过 `props.params` 拿到动态参数 id。
   - 编辑流程：跳转到编辑页、服务端获取发票数据、表单预填充、提交后调用 Server Action 更新数据并刷新缓存。
   - 主键建议使用 UUID 保证安全与唯一性（防止被枚举攻击）。

   **示例：动态路由页面**

   ```tsx
   // app/dashboard/invoices/[id]/edit/page.tsx
   export default async function EditPage({ params }) {
     const invoice = await fetchInvoiceById(params.id);
     return (
       <form action={updateInvoice}>
         <input name="amount" defaultValue={invoice.amount / 100} />
         {/* ...其他字段... */}
         <button type="submit">保存</button>
       </form>
     );
   }
   ```

6. FormData 的类型安全与最佳实践

   - `FormData.get()` 返回值都是字符串或 `null`，需要类型转换。
   - 推荐用 Zod（或 Yup、Joi 等）统一做服务端类型校验和转换，避免类型漏洞、脏数据入库。
   - 例如 `.coerce.number()` 可以自动把字符串转成数字。

   **示例：Zod 类型转换**

   ```typescript
   const schema = z.object({
     amount: z.coerce.number().gt(0, "金额必须大于0"),
   });
   schema.parse({ amount: "123" }); // 自动转为数字 123
   ```

7. revalidatePath API 的作用

   - 用于手动刷新某个页面（或路由段）的缓存，保证用户总能看到最新数据。
   - 增、删、改等操作完成后应调用，避免页面展示过期内容。

   **示例：刷新缓存**

   ```typescript
   revalidatePath("/dashboard/invoices"); // 刷新发票列表
   ```

8. 实践建议与总结
   - Server Actions 极大简化全栈开发流程，提升安全性和开发效率。
   - 表单 action 与 Server Actions 松耦合，支持无 JS/弱网场景。
   - 后端统一用 Zod 校验保证类型安全和数据一致性。
   - 动态路由让编辑、详情等页面实现更灵活。
   - revalidatePath/redirect 等 API 让数据与 UI 始终同步。

- 推荐阅读：
  - [Next.js 官方文档：Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
  - [Zod 文档](https://zod.dev/)
  - [FormData Web API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

## Next.js + Zod 表单校验

**1. 为什么要用 Zod 管理表单校验？**

- **原有问题**：传统的 if/else 手写校验容易出错、难以维护、代码分散。
- **Zod 优势**：声明式、类型安全、代码复用、前后端一致的数据结构。

---

**2. 校验规则单独抽离：schemas.ts**

- **目的**：将所有表单字段的校验规则集中在一个文件中，便于维护和复用。
- **做法**：
  - 用 zod 的 API 定义一个 InvoiceSchema，详细规定每个字段的类型、必填、范围等。
  - 利用 `omit` 方法再派生出 CreateInvoice（用于新建时不需要 id、date 字段）。

**示例代码：**

```typescript
import { z } from "zod";

export const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z
    .string({
      invalid_type_error: "请必须选择一个客户。",
    })
    .nonempty({
      message: "请选择一个客户，不能为空。",
    }),
  amount: z.coerce.number().gt(0, { message: "请输入一个大于 $0 的金额。" }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "请选择一个发票状态。",
  }),
  date: z.string(),
});

export const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });
```

- **优势**：每当涉及表单字段变动，只需维护一个 Schema 文件即可。

---

**3. Server Action 使用 Zod 简化校验逻辑**

- **旧写法**：大量 if/else 判断、手动组装错误对象。
- **新写法**：用 `CreateInvoice.safeParse(formData)` 一行搞定全部校验，错误信息自动结构化。

**示例代码片段：**

```typescript
const validatedFields = CreateInvoice.safeParse({
  customerId: formData.get("customerId"),
  amount: formData.get("amount"),
  status: formData.get("status"),
});

if (!validatedFields.success) {
  return {
    errors: validatedFields.error.flatten().fieldErrors,
    message: "表单数据无效，请修正后重试。",
  };
}
```

- **优点**：类型安全，校验更健壮，逻辑更清晰，FormState 结构与前端完全契合。

---

**4. 前端表单组件无缝对接**

- **优势**：前端只关心 `state.errors`，不关心错误信息的生成方式。
- **做法**：
  - 使用 `useActionState` 连接 server action（如 createInvoice）。
  - 利用 antd 的表单组件和 `state.errors`，自动展示后端返回的校验失败信息。

**伪代码结构：**

```tsx
const [state, dispatch] = useActionState(createInvoice, initialState);

<Form action={dispatch}>
  <Form.Item help={state.errors?.customerId?.join(', ')} ...>
    {/* ... */}
  </Form.Item>
  {/* ... 其他字段 ... */}
</Form>
```

- **好处**：前后端数据契约一致，前端组件无需为校验重构代码，体验平滑。

---

**5. 总结亮点**

- **逻辑分层**：校验逻辑与业务逻辑彻底分离，易读易维护。
- **后端健壮**：Zod 提供更丰富的边界检查，避免遗漏。
- **代码简洁**：大量冗余 if/else 被简化。
- **前端无感知**：错误结构保持一致，前端代码不需变动。
- **最佳实践**：契合现代全栈开发理念，前后端通过类型数据契约对齐。

---

**6. 推荐实践**

- 复杂表单都建议用 Zod 这样的 Schema 管理校验逻辑。
- 所有的错误对象结构应与前端约定一致，方便组件复用。
- 以后扩展表单字段或修改规则只需维护 schema 一处。

---

## Next.js 错误处理机制

**1. 服务器操作中的异常处理（try/catch）**

在 Next.js 的服务器端操作（如数据库 CRUD）中，合理使用 `try/catch` 可以帮助我们优雅地处理运行时错误。

- **建议**：所有可能抛出异常的操作都应包裹在 `try/catch` 中。
- 在 `catch` 里可以返回友好提示，或者根据业务需求执行特定的补救措施。
- **注意**：`redirect()` 之类会直接抛出异常的函数，不能放在 `try` 块内，否则会被 `catch` 捕获，导致流程异常。

**2. 路由级别的错误 UI（error.tsx）**

Next.js 支持为每个路由段（segment）自定义一个 `error.tsx` 文件，用于捕获当前段下所有未处理的异常。

- `error.tsx` 必须是客户端组件（记得加 `'use client'`）。
- 该组件接收 `error`（异常对象）和 `reset`（恢复函数）两个参数。
- 可以在此自定义用户友好的错误提示界面，并提供重试按钮等交互。
- 这样即使后台出错，用户也不会看到杂乱的报错，而是一个友好的页面。

**3. 针对 404 场景的处理（notFound 和 not-found.tsx）**

对于不存在的资源（比如找不到某个发票），Next.js 推荐用 `notFound()` 函数主动抛出 404。

- 在服务端数据获取逻辑中判断资源是否存在，不存在时调用 `notFound()`。
- `notFound()` 被触发时，会自动渲染同级目录下的 `not-found.tsx` 文件。
- 通过自定义 `not-found.tsx`，可以为用户展示自定义的 404 页面和返回按钮等。

**4. error.tsx 与 not-found.tsx 的优先级**

- `not-found.tsx` 的优先级高于 `error.tsx`。如果资源不存在并调用了 `notFound()`，将渲染 404 页面而不是通用错误页。
- 通常建议：
  - 资源不存在时用 `notFound()` 和 `not-found.tsx`
  - 其他服务器异常用 `error.tsx`

**5. 实际开发建议**

- 服务器操作时务必做好异常捕获，给前端返回明确的错误提示。
- 为核心路由（如涉及数据操作的页面）都加上 `error.tsx` 和 `not-found.tsx`。
- 错误 UI 设计应考虑用户体验，如“重试”或“返回首页”等操作按钮。
- 可以在 `error.tsx` 里加日志上报，方便监控线上错误。

**6. 相关文档推荐**

- [Next.js Error Handling 官方文档](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [error.tsx API 参考](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [notFound() API 参考](https://nextjs.org/docs/app/api-reference/functions/notfound)
- [not-found.tsx API 参考](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

---

## Zod 校验库简介

**1. 什么是 Zod？**

Zod 是一个 TypeScript 优先的**模式校验（Schema Validation）库**，用于在前端或后端代码中对数据进行结构和类型的声明式校验。它简单、灵活、与 TypeScript 深度集成，常用于表单校验、API 入参校验、数据转换等场景。

---

**2. Zod 的主要特点**

- **TypeScript 优先**：Zod 的 schema 自动为你推导出类型，类型和校验规则始终一致。
- **声明式 API**：用链式语法声明每个字段的类型、校验规则和错误信息，易读易维护。
- **无第三方依赖**：纯 TypeScript 实现，轻量安全。
- **可组合**：支持对象、数组、枚举、联合类型、嵌套等复杂数据结构的校验。
- **安全转换**：支持类型转换（如字符串转数字）。

---

**3. 基本用法示例**

- 定义 Schema

  ```typescript
  import { z } from "zod";

  const UserSchema = z.object({
    name: z.string().min(1, "姓名不能为空"),
    age: z.number().int().nonnegative(),
    email: z.string().email(),
  });
  ```

- 校验数据

  ```typescript
  // 校验成功
  const result = UserSchema.safeParse({
    name: "张三",
    age: 25,
    email: "zhangsan@example.com",
  });
  // result.success === true

  // 校验失败
  const bad = UserSchema.safeParse({
    name: "",
    age: -3,
    email: "not-an-email",
  });
  // bad.success === false，bad.error 包含详细错误
  ```

- 提取类型

```typescript
type User = z.infer<typeof UserSchema>;
```

---

**4. 进阶特性**

- **嵌套对象/数组**：支持任意层级的嵌套校验。
- **枚举与联合类型**：如 `z.enum(['A', 'B'])`、`z.union([z.string(), z.number()])`
- **自定义校验**：用 `.refine()` 或 `.superRefine()` 定制更复杂的校验逻辑。
- **类型转换**：如 `z.coerce.number()` 自动把字符串转为数字。
- **错误信息定制**：每个规则都可自定义报错提示。

---

**5. 常见应用场景**

- React/Vue/Next.js 等前端表单校验
- Node.js/Express/Koa/Fastify 等后端接口参数校验
- API 数据解析与类型安全
- 数据迁移、脚本、配置文件校验

---

**6. Zod 与其他校验库对比**

| 特性       | Zod      | Yup         | Joi      |
| ---------- | -------- | ----------- | -------- |
| TypeScript | 原生支持 | 部分支持    | 无       |
| 体积       | 小       | 较小        | 较大     |
| API 风格   | 链式声明 | 链式声明    | 链式声明 |
| 类型推导   | 自动     | 需额外配置  | 无       |
| 依赖       | 无       | 依赖 lodash | 依赖     |

---

**7. 官方文档**

- [Zod 官方文档](https://zod.dev/)
- [GitHub 仓库](https://github.com/colinhacks/zod)

---

## 如何使用 next/image 组件

[next/image 官方文档](https://nextjs.org/docs/app/api-reference/components/image)

1. 基本用法

   - `next/image` 是 Next.js 的内置图片优化组件，自动实现懒加载、响应式图片、图片格式优化等。
   - 必须传递 `src`（图片路径）、`alt`（图片描述）、`width` 和 `height`（图片尺寸，单位 px）。

   **示例代码：**

   ```jsx
   import Image from "next/image";

   export default function MyComponent() {
     return (
       <Image
         src="/images/example.jpg" // 本地 public 下图片或远程图片地址
         alt="描述文本"
         width={500}
         height={300}
       />
     );
   }
   ```

   - `src`：支持本地 `/public` 下路径或远程图片。
   - `alt`：无障碍图片描述，必填。
   - `width`、`height`：必须指定，否则图片不会正常显示。

2. 常用属性

   - `layout`：图片布局方式。常见值：
     - `"fixed"`（默认）：固定宽高。
     - `"responsive"`：宽度自适应父容器，高度等比缩放。
     - `"fill"`：填满父容器，需配合父容器 `position: relative`。
   - `priority`：优先加载图片（如首屏大图）。
   - `placeholder`：占位类型，常用 `"blur"` 实现模糊占位。
   - `blurDataURL`：自定义模糊图片的 url，可用小图或 base64。
   - `lodaer`: 图片加载器，可自定义图片加载方式。

     - 自定义 loader 后，图片不会再走 Next.js 内置的图片优化（即不会经过 /\_next/image 路径），而是直接用你生成的 URL。
     - 仅当你有自定义图片服务需求时才需要自定义 loader，普通项目建议使用 Next.js 默认优化。

     ```tsx
     import Image from "next/image";

     const customLoad = ({ src }) => src;

     const MyImage = (props) => {
       return <Image {...props} loader={customLoad} />;
     };

     MyImage.displayName = "Image";

     export default MyImage;
     ```

   - `displayName`: 用于在 React DevTools 中显示组件名称。

**示例代码：**

```jsx
<Image
  src="/images/example.jpg"
  alt="示例图片"
  width={500}
  height={300}
  placeholder="blur"
  blurDataURL="/images/blur.jpg"
/>
```

3. 远程图片用法

   - 需要在 `next.config.js` 配置允许的远程图片域名。

   **配置示例：**

   ```js
   // next.config.js
   module.exports = {
     images: {
       domains: ["example.com"],
     },
   };
   ```

   **使用示例：**

   ```jsx
   <Image
     src="https://example.com/pic.jpg"
     alt="远程图片"
     width={400}
     height={200}
   />
   ```

4. 响应式图片

   - 使用 `layout="responsive"`，图片宽度适应父容器，高度按比例缩放。

   **示例代码：**

   ```jsx
   <div style={{ width: 300 }}>
     <Image
       src="/images/photo.jpg"
       alt="响应式图片"
       width={1200}
       height={800}
       layout="responsive"
     />
   </div>
   ```

5. 占位模糊效果

   - 用于提升大图首屏体验，先展示模糊占位。

   **示例代码：**

   ```jsx
   <Image
     src="/images/sample.jpg"
     alt="模糊占位图片"
     width={800}
     height={400}
     placeholder="blur"
     blurDataURL="/images/sample-blur.jpg" // 可用小尺寸或 base64 图片
   />
   ```

6. 注意事项

   - `width` 和 `height` 必须指定，否则图片不显示。
   - 本地图片路径基于 `/public` 目录。
   - 远程图片需配置 `images.domains`。
   - `layout="fill"` 时父元素需 `position: relative`，且不需再指定 `width`/`height`。

7. 参考
   - [Next.js 官方文档：Image 组件](https://nextjs.org/docs/app/api-reference/components/image)

## nextjs 中 useRouter 错误引入

这个报错 `Error: NextRouter was not mounted.` 通常发生在 Next.js 应用中，当你尝试在不正确的上下文中使用 `useRouter` Hook 时 。

根据你的文件路径 `src/app/register/page.jsx`，你的项目正在使用 Next.js 的 **App Router** 。

然而，在你的代码中，你导入 `useRouter` 的方式是：

```
import { useRouter } from "next/router";
```

这个导入路径是用于 **Pages Router** 的 。

**问题原因：** 你在 App Router 的页面 (`src/app/...`) 中使用了 Pages Router 的 `useRouter` Hook。这两个路由系统有不同的 API 。

**解决方法：** 你需要将 `useRouter` 的导入路径更改为 App Router 对应的 `next/navigation` 。

请将你的代码中的导入语句修改为：

JavaScript

```
import { useRouter } from "next/navigation";
```

## Ant Design 静态方法与 React Context 问题 (`<App>` 组件)

**日期:** 2025 年 05 月 01 日

**主题:** 理解并解决 Ant Design 警告: `Warning: [antd: Modal] Static function can not consume context like dynamic theme. Please use 'App' component instead.`

**受影响的方法:** 主要包括 `Modal.confirm()`, `Modal.info()`, `Modal.success()`, `Modal.error()`, `Modal.warning()`, `message.success()`, `message.error()`, `message.info()`, `message.warning()`, `message.loading()`, `notification.open()` 等静态调用方法。

---

#### 问题描述

当在代码中直接（静态地）调用 `Modal.confirm(...)` 或 `message.success(...)` 这类方法时，浏览器的开发者控制台会出现上述警告。该警告指出这些静态函数无法消费（获取）像动态主题这样的 React Context 信息。

#### 问题根源：静态方法 vs React Context

1. **React Context (上下文):** 这是 React 提供的一种机制，允许数据（例如主题配置、语言设置、用户信息等）在组件树中向下传递，而无需手动地在每一层都传递 props。Ant Design 使用 `<ConfigProvider>` 组件来提供主题、国际化等全局配置的 Context。
2. **静态方法 (Static Methods):**像 `Modal.confirm` 这样的方法是直接在导入的 `Modal` 对象上调用的，而不是在 React 组件树中渲染的某个实例上调用。这些方法的调用发生在触发它们的 React 组件的常规渲染生命周期和上下文之外。
3. **核心矛盾:** 由于这些静态方法在 React 组件实例的上下文之外执行，它们无法“看到”或“访问”由上层 `<ConfigProvider>` 等组件提供的 Context。因此，它们对应用内设置的主题、语言等配置是“无感知”的。

#### 解决方案: `<App />` 组件与 `useApp` Hook

为了解决这个问题，Ant Design v5 版本引入了 `<App />` 组件和 `App.useApp()` 这个 Hook：

1. **`<App />` 组件包裹:** 你需要在应用的根节点附近（通常在 `<ConfigProvider>` 内部）使用 `<App />` 组件包裹你的主要应用内容。这个 `<App />` 组件会创建一个特殊的上下文环境，并在内部管理 `modal`, `message`, `notification` 等服务的实例。
2. **`App.useApp()` Hook:** 在 `<App />` 组件包裹下的**任何子组件**中，可以通过调用 `App.useApp()` 这个 Hook 来获取一个包含 `modal`, `message`, `notification` 实例的对象。这些实例是**能够感知到 Context** 的。
3. **正确用法:**
   - **第一步:** 在你的根布局文件（如 `layout.jsx`）中，用 `<App>` 包裹你的应用主体。
   - **第二步:** 在你需要调用 `Modal`, `message`, `notification` 的**具体组件**中，导入 `App` 并调用 `const { modal, message, notification } = App.useApp();`。
   - **第三步:** 将原先的静态调用（如 `Modal.confirm(...)`）替换为通过 Hook 获取到的实例调用（如 `modal.confirm(...)`）。

#### 如果不使用 `<App />` 包裹会怎么样？

如果你选择不使用 `<App />` 组件包裹应用，或者继续使用静态方法调用，会导致以下后果：

1. **主题样式不一致:** 这是最直接的影响。通过静态方法创建的 `Modal`, `message`, `notification` 组件**无法应用**通过 `<ConfigProvider>` 设置的**动态主题**。例如，当你的应用切换到暗色模式时，这些弹窗或提示可能仍然显示为默认的亮色模式样式，造成界面视觉风格的割裂和不统一。
2. **其他 Context 配置失效:** 虽然动态主题是最典型的例子，但理论上 `<ConfigProvider>` 提供的其他基于 Context 的配置（如国际化语言包影响默认按钮文字、全局组件尺寸等，如果这些配置未来会影响静态方法的话）也可能无法被这些静态组件获取。
3. **持续的控制台警告:** 浏览器开发者工具中会一直显示该警告信息，这表明你的代码实践与 Ant Design 的推荐方式不符，也可能干扰调试。
4. **潜在的未来兼容性问题:** Ant Design 未来可能会更加依赖 Context 机制来配置组件行为。坚持使用旧的静态方法调用方式，在未来升级 antd 版本时，可能会遇到更多难以预料的行为或兼容性问题。

#### 总结

Ant Design 中关于静态方法无法消费 Context 的警告，源于全局静态调用与 React 组件树上下文之间的隔离。使用 `<App />` 组件包裹应用并在具体组件中通过 `App.useApp()` Hook 获取 `modal`, `message`, `notification` 实例，是 antd v5+ 官方推荐的、确保这些全局提示/弹窗能正确继承上下文（尤其是动态主题）的**标准解决方案**。忽略此模式会导致 UI 样式不一致，并可能引发未来的维护和兼容性风险。

## Next.js + Auth.js 权限控制与登录流程全解

**整体流程与核心原理**

在 Next.js 应用中结合 Auth.js（NextAuth），你可以通过配置 `auth.config.ts`、`auth.ts` 及 `middleware.ts`，实现灵活的页面访问控制。整个流程核心包括：

- **路由列表分组**：哪些页面是公开的，哪些需要登录，哪些是认证页面。
- **中间件拦截**：所有页面请求都会被 middleware.ts 拦截，再决定是否放行或重定向。
- **权限判断与角色控制**：通过解密的 JWT（Session Token）携带用户身份与角色，灵活配置权限。
- **登录流程体验优化**：自动带上 callbackUrl，登录成功后回到原目标页。

---

**auth.config.ts 路由权限配置**

**目标需求**：未登录用户只能访问页面 A、B，不能访问 C、D、E、F。登录后可访问所有页面。

- 实现思路：

  1. **分组路由列表**

  - `publicRoutes`: 未登录可访问（如 `/public-page-a`, `/public-page-b`）
  - `protectedRoutes`: 登录才能访问（如 `/dashboard`, `/products`, `/orders`，使用前缀匹配可覆盖子页面）
  - `authRoutes`: 登录页面本身（如 `/login`），已登录用户访问时应重定向到主页

  2. **配置 callbacks.authorized**  
     逻辑顺序如下：

  - 若访问受保护路由，未登录则拦截
  - 若访问登录页，已登录则重定向到主页
  - 其他页面默认放行

  ```typescript
  // auth.config.ts
  import type { NextAuthConfig } from "next-auth";

  const publicRoutes = ["/public-page-a", "/public-page-b"];
  const protectedRoutes = ["/dashboard", "/products", "/orders"];
  const authRoutes = ["/login"];

  export const authConfig = {
    pages: { signIn: "/login" },
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const { pathname } = nextUrl;

        // 受保护路由
        const isOnProtectedRoute = protectedRoutes.some((route) =>
          pathname.startsWith(route)
        );
        if (isOnProtectedRoute) return isLoggedIn;

        // 登录页面
        const isOnAuthRoute = authRoutes.some((route) =>
          pathname.startsWith(route)
        );
        if (isOnAuthRoute) {
          if (isLoggedIn) {
            // 已登录访问登录页，重定向到 dashboard
            return Response.redirect(new URL("/dashboard", nextUrl));
          }
          return true;
        }

        // 其他（如 publicRoutes），默认放行
        return true;
      },
    },
  } satisfies NextAuthConfig;
  ```

---

**middleware.ts 中间件机制详解**

- middleware.ts 是什么？如何被执行？

  - 它是 Next.js 的“中央保安”，拦截所有页面请求，决定是否放行或重定向
  - 通过“名字和位置约定”自动生效：只要在根目录或 `src/` 下有 middleware.ts (或 .js/.mjs)，Next.js 自动识别
  - 运行在 Edge Runtime，速度快且离用户近

- 典型代码结构与注释说明：

  ```typescript
  // middleware.ts
  import NextAuth from "next-auth";
  import { authConfig } from "./auth.config";

  // 初始化 Auth.js 并导出中间件
  export default NextAuth(authConfig).auth;

  // 配置 matcher 只拦截实际页面请求，静态资源、API 路由等不拦截
  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
  };
  ```

- `matcher` 优化性能，只针对实际页面做权限校验

---

**providers 配置详解**

- providers 决定了你支持哪些登录方式。分为两大类：

  1. OAuth Provider（如 Google、GitHub）

  - 只需配置 `clientId`/`clientSecret`
  - 用户跳转至第三方授权页面，授权后回调到你站点
  - 适合无自定义用户体系的场景

  ```typescript
  import Google from "next-auth/providers/google";
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ];
  ```

  2. Credentials Provider（账号密码登录）

  - 需自定义 authorize 逻辑（如查库、比对密码）
  - 适合有自定义用户表/权限设计的场景

  ```typescript
  import Credentials from "next-auth/providers/credentials";
  providers: [
    Credentials({
      async authorize(credentials) {
        // 验证逻辑（查库、比对密码）
        // 返回 user 对象则登录成功，否则失败
      },
    }),
  ];
  ```

- 最佳实践：
  所有需要用到 Node.js 模块（如数据库、bcrypt）的 provider 配置都放在 `auth.ts`，避免 Edge Runtime 报错。

---

**auth.ts 实例代码逐行详解**

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

// 建立数据库连接
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// 查找用户辅助函数
async function getUser(email: string): Promise<User | undefined> {
  const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
  return user[0];
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. 检查格式
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsed.success) {
          const { email, password } = parsed.data;
          // 2. 查库
          const user = await getUser(email);
          if (!user) return null;
          // 3. 密码比对
          const match = await bcrypt.compare(password, user.password);
          if (match) return user;
        }
        // 4. 验证失败
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
```

- **zod**：前端/后端通用的数据校验
- **bcrypt**：密码哈希与比对，保障安全
- **getUser**：数据库查找用户
- **authorize**：整个自定义登录核心

---

**登录表单 callbackUrl 流程解释**

**callbackUrl 用于：登录后自动回到原目标页**

- 完整流程

  1. **用户访问受保护页面**（如 `/dashboard/invoices`），未登录被中间件拦截
  2. **中间件重定向到登录页**，自动带上 `?callbackUrl=/dashboard/invoices`
  3. **登录表单组件**用 `useSearchParams().get('callbackUrl')` 读取参数，写入 `<input type="hidden" name="redirectTo" value={callbackUrl} />`
  4. **表单提交**时，`redirectTo` 字段随表单一起 POST 到后端 Server Action
  5. **Server Action（authenticate）** 读取 `redirectTo`，登录后自动 `redirect(redirectTo)`
  6. **用户被送回最初想访问的页面**

- 代码片段

  ```tsx
  // LoginForm.tsx (核心片段)
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  <input type="hidden" name="redirectTo" value={callbackUrl} />;
  ```

  ```typescript
  // authenticate Server Action
  export async function authenticate(_, formData: FormData) {
    await signIn("credentials", formData); // 登录
    const redirectTo = formData.get("redirectTo") || "/dashboard";
    redirect(redirectTo); // 跳转回原页面
  }
  ```

---

**auth 对象的来源与权限配置**

- auth 对象来源

  1. **用户登录**时，`authorize` 返回 user 对象
  2. **user 数据被写入 JWT**（callbacks.jwt），JWT 存在 Cookie
  3. **后续请求**中，middleware 解密 JWT 得到 auth 对象，传递给 authorized 回调

- 配置角色权限的完整流程

  1. **数据库 user 表**增加 role 字段（如 `admin`/`user`）
  2. **authorize 返回的 user**包含 role
  3. **callbacks.jwt** 把 role 写进 token
  4. **middleware 调用 authorized** 时，auth.user 里就有 role，可用来判断权限

- 示例：仅管理员能访问 /admin，下例中只有 role 为 admin 才能访问 /admin 页面：

  ```typescript
  // auth.config.ts
  export const authConfig = {
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const pathname = nextUrl.pathname;

        if (pathname.startsWith("/admin")) {
          // 只有 admin 角色放行
          return isLoggedIn && auth.user?.role === "admin";
        }

        // 其他保护逻辑...
        return isLoggedIn;
      },
    },
    // providers...
  };
  ```

- 类型扩展：

  为 TypeScript 类型推断更智能，增加 auth.d.ts：

  ```typescript
  // auth.d.ts
  import "next-auth";

  declare module "next-auth" {
    interface Session {
      user: { role: "admin" | "user" } & DefaultSession["user"];
    }
    interface User {
      role: "admin" | "user";
    }
  }
  declare module "next-auth/jwt" {
    interface JWT {
      role: "admin" | "user";
    }
  }
  ```

---

- 总结

  - **auth.config.ts** 管理页面访问规则，逻辑清晰
  - **middleware.ts** 自动拦截请求，执行权限判断
  - **providers** 决定登录方式，强烈建议放在 auth.ts
  - **auth.ts** 实现自定义登录逻辑，安全查库与比对密码
  - **callbackUrl** 串起“原目标页-登录页-成功后跳转”的完整用户体验
  - **auth 对象** 来源于 JWT，权限信息可随用户登录流程动态传递和校验

---

> **参考链接**
>
> - [Auth.js 官方文档](https://authjs.dev/getting-started/)
> - [Next.js Middleware 官方文档](https://nextjs.org/docs/app/building-your-application/routing/middleware)
> - [Vercel Next.js Dashboard Example](https://github.com/vercel/nextjs-dashboard)

## 遇到报错 Warning: [antd: compatible] antd v5 support React is 16 ~ 18. see https://u.ant.design/v5-for-19 for compatible.

- 警告信息解析
  这个警告信息明确指出了 Ant Design v5 官方支持的 React 版本范围是 16.x 到 18.x，而你的项目正在使用的 React 版本可能是 19.x 或更高。这种不兼容性导致 Ant Design 的一些功能（如波浪效果、Modal、Notification、Message 的静态方法）可能无法正常工作。

- 原因分析
  Ant Design v5 在设计时，是基于 React 16.x 到 18.x 的 API 规范进行开发的。当 React 19 调整了 react-dom 的导出方法时，Ant Design v5 无法直接使用 ReactDOM.render 方法，从而引发了兼容性问题。

- 解决方案
  针对这个问题，推荐使用 Ant Design 官方提供的兼容性包或使用 unstableSetRender 方法(不推荐)。

- 使用兼容性包解决
  安装兼容性包：

```bash
pnpm add @ant-design/v5-patch-for-react-19 --save
```

在项目入口导入

```bash
import '@ant-design/v5-patch-for-react-19';
```
