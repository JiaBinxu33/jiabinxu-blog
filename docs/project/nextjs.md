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

## nextjs 项目的.env.local 文件

`.env.local` 是一个本地环境变量文件，用于存储敏感信息或特定于开发环境的配置

#### **NEXT*PUBLIC***前缀

表示这个变量会被内联到客户端 JavaScript 中

可以用来存放全局的 baseUrl

```
NEXT_PUBLIC_API_BASE_URL=https://your-actual-api-url.com/api
```

组件中使用

```
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
```

#### 无前缀变量

只能在 Node.js 环境中使用（服务器端）

```
SECRET_KEY=mysecret
```

只能在 API 路由或 `getServerSideProps` 等服务器端代码中使用

#### 注意事项

1. **重启服务**：修改 `.env.local` 后需要重启开发服务器才能生效

2. **类型支持**：在 TypeScript 项目中，需要在 `next-env.d.ts` 或自定义类型文件中声明环境变量

   ```
   declare namespace NodeJS {
     interface ProcessEnv {
       NEXT_PUBLIC_API_URL: string;
       DB_HOST?: string;
     }
   }
   ```

3. **生产环境**：在生产环境中，通常使用平台提供的环境变量配置，而不是 `.env.local` 文件

## 为项目添加可使用@引入

### 修改 next.config.mjs

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

### 配置 jsconfig.json/tsconfig.json

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

### 注意事项

- jsconfig.json 中
  不需要单独为每个文件配置路径，直接配置根路径，根路径下所有子文件夹都可以被访问到
- 组件中使用：@/xxx，注意斜杠，要使用@/，不是只有@，根据 jsconfig.json 中的配置作为判断依据
