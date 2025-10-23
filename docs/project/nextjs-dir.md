# Next.js 项目文件夹结构笔记

在 Next.js (以及许多现代前端) 项目中，一个清晰的文件夹结构对于代码的可维护性至关重要。每个文件夹都有其特定的职责和抽象层次。

## `app/` (或 `pages/`) - 核心路由

这是 Next.js 项目的核心。

* **`app/` (App Router - 推荐):**
    * 这是 Next.js 最新的路由方式。
    * **文件夹**定义了 URL 路径（例如 `app/dashboard/settings/` 对应 `.../dashboard/settings`）。
    * `page.tsx` (或 `.js/jsx`) 文件是该路径下实际展示给用户的 UI 界面。
    * `layout.tsx` (或 `.js/jsx`) 定义了该路径及其子路径共享的布局。

* **`pages/` (Pages Router - 传统):**
    * 这是旧版的路由方式。
    * **文件**定义了 URL 路径（例如 `pages/profile.js` 对应 `.../profile`）。
    * `_app.js` 和 `_document.js` 是特殊的全局配置文件。

**职责：** 存放应用的页面、路由逻辑和特定于页面的数据获取。

---

## `public/` - 静态资源服务

`public` 文件夹的作用非常单纯：**告诉 Web 服务器，请把这个文件夹里的所有内容都变成可以通过 URL 直接访问的网络资源。**

#### 1. 核心原理：服务器与客户端的隔离

* **服务器 (Server)**：是你的代码和文件存放的地方（例如你的电脑或 Vercel 服务器）。`public` 文件夹物理上存在于服务器。
* **客户端 (Client)**：是用户的网页浏览器（Chrome, Safari 等）。它对服务器的文件系统**一无所知**，它不能直接“读取”你项目中的 `public` 文件夹。

#### 2. 工作方式：网络 URL 映射

当你把文件（如 `logo.png`）放入 `public` 文件夹时，Next.js 服务器会为它创建一个 URL 映射：

* **服务器文件路径:** `.../你的项目/public/logo.png`
* **映射为网络 URL:** `http://你的网站.com/logo.png`

因此，在你的代码中，你**必须**通过根路径 `/` (代表 `public` 文件夹) 来引用它，浏览器会通过网络请求来获取这个文件。

**正确用法：**

```jsx
// 浏览器会发起一个 GET http://.../logo.png 的请求
<img src="/logo.png" alt="Logo" />

// 浏览器会发起一个 GET http://.../music.mp3 的请求
fetch('/music.mp3')
```
**错误用法：**

```jsx
// 客户端（浏览器）无法访问本地文件系统！
<img src="../public/logo.png" alt="Error" />
```
职责： 存放不需要经过编译处理的静态文件，如图片、Favicon、robots.txt、字体文件、音频/视频文件等。

## `components/` - 可复用组件

这是一个通用的约定文件夹（Next.js 不会强制要求）。

* **职责：** 存放构成你 UI 的可复用“积木”。
* **示例：** `Button.tsx`, `Modal.tsx`, `Navbar.tsx`, `Layout.tsx`。
* **好处：** 保持 `app/` 目录的整洁，使路由文件只专注于“页面”逻辑，而 `components/` 专注于“UI 零件”。

---

## `hooks/` - 可复用的 React 逻辑

这是一个 React 项目中非常重要的约定文件夹。

* **职责：** 抽离和封装**可复用的、有状态的** React 逻辑。

* **核心区别：`hooks/` vs. `utils/`**
    * “hooks 和普通的辅助函数有什么区别”是 React 架构的核心问题。
    * **`utils/` 辅助函数 (Helper Function):**
        * 是一个**普通的 JavaScript 函数**。
        * **不能**调用 React 的 `useState`, `useEffect`, `useContext` 等（因为它们不是 React 组件或 Hook）。
        * 可以在任何地方调用（组件外、循环中、条件里）。
        * **示例：** `formatDate(date)` (纯数据转换), `isValidEmail(email)` (纯逻辑判断)。
    * **`hooks/` 自定义 Hook (Custom Hook):**
        * 是一个**特殊的 JavaScript 函数**，其名称**必须**以 `use` 开头（例如 `useWindowSize`）。
        * 其**唯一目的**是封装 React 特有的功能（状态、生命周期、上下文）。
        * **可以**（也通常会）调用 `useState`, `useEffect` 等其他 Hook。
        * **必须**遵守 "Rules of Hooks"（只能在组件的顶层或另一个 Hook 中调用）。

* **什么时候应该封装 Hook？**
    * 当你发现你在两个或多个组件中编写了**完全相同的 `useState` 和 `useEffect` 逻辑**时。
    * **示例：**
        * `hooks/useWindowSize.ts`: 封装了 `useState` 和 `useEffect` 来监听窗口尺寸变化。
        * `hooks/useFetch.ts`: 封装了 `useState` (用于 `data`, `loading`, `error`) 和 `useEffect` (用于 `fetch`)。
        * `hooks/useDebounce.ts`: 封装了 `useState` 和 `useEffect` 来实现防抖。

---

## `utils/` (工具箱)

* **职责：** 提供**通用的、无状态的、纯粹的** JavaScript 功能。
* **特点：**
    * **通用性：** 它们是完全独立的，不关心你的任何业务逻辑。`formatDate` 函数不关心你格式化的是“生日”还是“订单日期”。
    * **无状态：** 严格无状态，不存储或管理应用状态。
    * **可移植：** 你几乎可以把 `utils` 里的文件直接复制到任何其他项目中去使用。
* **示例：**
    * `utils/format.ts` (包含 `formatDate`, `formatCurrency`)
    * `utils/validators.ts` (包含 `isValidEmail`)
    * `utils/cn.ts` (用于合并 Tailwind class)

---

## `lib/` (项目库/辅助库)

* **职责：** 存放**项目特定的、共享的**辅助代码、配置、实例或**常量**。
* **特点：**
    * **项目特定：** 它不像 `utils` 那么通用，它被设计为在该项目中复用。
    * **配置/设置：** 经常用于初始化和配置第三方库（例如 `lib/db.ts` 导出一个 Prisma 实例）。
    * **存放常量:** 这是存放“静态变量”或“魔法数字”的最佳位置，例如 `API_BASE_URL`、`DEFAULT_PAGE_SIZE`、或用于 `enum` 的对象。这比将它们硬编码在组件中要好得多。
* **示例：**
    * `lib/db.ts` (设置和导出 Prisma 或 Drizzle 客户端实例)
    * `lib/auth.ts` (配置 NextAuth.js 的选项)
    * `lib/types.ts` (存放项目共享的 TypeScript 接口，如 `IUser`, `IProduct`)
    * **`lib/constants.ts` (存放如 `API_BASE_URL`, `SEO_KEYWORDS` 这样的常量)**

---

## `services/` (业务服务)

* **职责：** 封装一个**完整的、领域特定的**业务能力，作为“专家”供其他代码调用。
* **特点：**
    * **架构级抽象：** 核心是“做什么事”，而不是“如何做”。
    * **封装实现：** 调用者（如组件或 Hook）**不需要关心**任何实现细节。
    * **领域特定：** 它们懂业务。`storageService` 知道你的存档键名是 `TETRIS_GAME_STATE`，知道数据类型是 `IGameState`。
    * **可能有状态：** `service` 内部可以持有状态（例如 `audioService` 可以记住哪些音频已被加载）。
* **示例：**
    * `services/storageService.ts` (封装 `saveState`, `loadState`，调用者无需知道用的是 `localStorage` 还是 `IndexedDB`)
    * `services/apiService.ts` (封装所有的 `fetch` 请求，统一处理认证、错误和数据转换)
    * `services/audioService.ts` (封装 `loadSounds`, `playSoundClip`，调用者无需关心 Web Audio API 的复杂性)

---

### 总结对比

| 特性 | `utils/` (工具) | `hooks/` (React逻辑) | `lib/` (库) | `services/` (专家/部门) |
| :--- | :--- | :--- | :--- | :--- |
| **职责** | 通用、无状态的JS功能 | **有状态的React逻辑** | 项目特定、共享的设置与实例 | 封装一个完整的业务能力 |
| **抽象** | 代码级（如何做） | **UI逻辑级（如何响应）** | 项目级（共享的定义） | 架构级（做什么） |
| **状态** | 严格无状态 | **有状态 (useState)** | 一般无状态（但可导出实例） | **可以有内部状态** |
| **示例** | `formatDate()` | `useWindowSize()` | `db.ts`, `lib/constants.ts` | `storageService.saveState()` |