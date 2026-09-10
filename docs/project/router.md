React Router DOM、Next.js Pages Router 以及 Next.js App Router 代表了三种不同时代与技术路线的前端路由解决方案。

## **传统路由 (react-router-dom) 与 Next.js 路由**

- **定义方式与样板代码**：`react-router-dom` 属于集中式路由表映射，新增或调整页面均需手动编写路由配置（如 `<Route>` 或路由对象）与引入组件；Next.js 采用“约定优于配置”的**文件/目录即路由**，创建文件自动映射对应路径，消除了路由表维护的样板代码。
- **生命周期与导航 Hook 体系**：`react-router-dom` 依赖纯客户端的生命周期与路由 Hook（如 `useNavigate`）；Next.js 拥有框架接管的生命周期体系，提供专用的导航 Hook（`next/navigation` 中的 `usePathname`、`useParams` 等），并结合边缘中间件（`middleware.ts`）与服务端渲染节点，控制页面的初始化、数据流式传输与路由阻断。

## **Next.js Pages Router 与 App Router 的核心演进**

- **底层渲染架构变革**：Pages Router 基于传统的客户端组件（Client Components），SSR 后仍需将全量 JS 发送到客户端进行水合（Hydration）；App Router 基于 **React Server Components (RSC)**，组件默认在服务端渲染且代码不计入客户端 Bundle，性能更好并支持流式传输（Streaming）。
- **目录结构与同级组织（Co-location）**：
  - **Pages Router (pages/)**：任何文件（如 `pages/Button.tsx`）都会被自动识别为路由，无法将局部 UI 组件或工具函数放在页面同级。
  - **App Router (app/)**：仅包含约定的 **page.tsx** 文件夹才会被解析为页面路径，支持将组件、样式和辅助代码放至 `page.tsx` 的**同级目录下**，结构更清晰。
- **布局机制与高级路由**：两者均支持动态路由（如 `[id]`），但 App Router 引入了真正的**原生嵌套布局（layout.tsx）**。在子路由间切换时，父级 Layout 保持挂载且不触发重绘，可持久化 UI 状态；同时提供开箱即用的状态约定（`loading.tsx`、`error.tsx`）以及平行路由、拦截路由等复杂路由场景。

## 核心区别

| **维度**               | **React Router DOM**                             | **Next.js Pages Router**                            | **Next.js App Router**                        |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------- | --------------------------------------------- |
| **定位**               | 客户端单页应用 (SPA) 路由库                      | 传统的全栈/框架层文件路由                           | 基于 React 架构演进的全栈架构路由             |
| **路由映射机制**       | 代码配置式（JSX 声明或对象配置）                 | 基于 `pages/` 目录的文件系统路由                    | 基于 `app/` 目录的文件夹结构与约定文件名      |
| **默认组件类型**       | 客户端组件 (Client Component)                    | 客户端组件（支持服务端预渲染）                      | 服务端组件 (React Server Component, RSC)      |
| **嵌套布局 (Layout)**  | 支持（通过 `<Outlet/>`）                         | 弱支持（需借助 `_app.js` 或自定义模式）             | 原生强支持（开箱即用的 `layout.tsx` 嵌套）    |
| **数据获取方式**       | 客户端 `useEffect` / React Query 或 Route Loader | 页面级钩子：`getStaticProps` / `getServerSideProps` | 任意服务端组件内直接 `async/await fetch`      |
| **流式渲染与 Loading** | 需手动结合 `React.lazy` + `<Suspense>`           | 仅限客户端级 Loading                                | 原生支持组件级 Streaming SSR（`loading.tsx`） |
| **打包与代码分割**     | 依赖开发者手动配置 `import()` 分割               | 自动按页面 (Page-level) 拆分 Chunk                  | 自动按组件及路由段 (Route Segment) 拆分       |
