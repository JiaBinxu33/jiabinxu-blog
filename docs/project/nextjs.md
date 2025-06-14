# nextjs - 15 版本及以上

## 介绍

nextjs 官网：https://nextjs.org/docs/getting-started
Next.js 是一个 React 框架，它允许你使用 React 框架建立超强的、有利于 SEO 的、极度面向用户的静态网站和网络应用。Next.js 以在构建具有你所需要的所有功能的生产就绪的应用程序时的最佳开发者体验而闻名。

它具有混合静态和服务器渲染、TypeScript 支持、智能捆绑、路由预取等功能，无需额外配置。

### 环境准备

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
