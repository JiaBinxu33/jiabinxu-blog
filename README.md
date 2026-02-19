# Jia Binxu's Personal Technical Blog

欢迎访问我的个人技术博客，这里记录了我的学习笔记、项目实践和技术思考。

## 🌐 在线访问

[博客主页](https://jiabinxu33.github.io/jiabinxu-blog/)

---

## 🚀 本地开发与运行

本项目支持多种包管理器（推荐使用 pnpm，亦可用 yarn 或 npm）。

### 1. 克隆项目

```bash
git clone -b master https://github.com/Jiabinxu33/jiabinxu-blog.git
cd jiabinxu-blog
```

### 2. 安装依赖

**推荐使用 pnpm：**

```bash
pnpm install
```

**或使用 yarn：**

```bash
yarn install
```

**或使用 npm：**

```bash
npm install
```

> ⚠️ 建议只保留一种 lock 文件（如使用 pnpm，请删除 yarn.lock 和 package-lock.json）。

### 3. 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或 yarn
yarn dev

# 或 npm
npm run dev
```

### 4. 打包与部署

```bash
# 打包
yarn build

# 部署到远程（如有部署脚本）
yarn deploy
```

---

## 📦 目录结构说明

```
├── docs/           # 博客内容与文档
├── .gitignore      # Git 忽略文件
├── package.json    # 项目依赖与脚本
├── yarn.lock       # yarn 依赖锁定文件（如用 pnpm 可删除）
├── pnpm-lock.yaml  # pnpm 依赖锁定文件（如用 yarn 可删除）
├── package-lock.json # npm 依赖锁定文件（如用 pnpm/yarn 可删除）
├── README.md       # 项目说明
├── deploy.sh       # 部署脚本
└── ...
```

---

## 🛠️ 配置与常见问题

- 配置文件位于 `docs/.vuepress/config.js`（如使用 VuePress）。
- 跳转链接写法示例：

  ```
  [要展示的文字](#链接到的地址)
  // 在下面要有相对应的地址，方可跳转
  ### 链接到的地址
  ```

- **切换包管理器时请清理 node_modules 和 lock 文件，避免依赖冲突。**

---
