---
name: environment-config
description: 提供项目开发环境配置指引，包括 Node.js、包管理器、构建工具的安装和配置。当用户需要初始化开发环境、安装项目依赖、配置构建工具时使用此 skill
---

# 环境配置

## 概述

这个 skill 用于项目开发环境的初始化配置。

**核心能力**：

- Node.js 环境检查与安装（通过 nvm 管理）
- 包管理器安装与配置
- 项目专属构建工具安装
- 项目依赖安装

## 重要约束

**强制要求**：执行每个命令时均要求用户确认，不允许不经用户同意修改环境配置和安装依赖。

## 工作流程

请严格根据以下工作流程制定 TODOList 并分步骤执行，禁止遗漏步骤，如果有不确认的地方请咨询用户

### 步骤 1: Node.js 环境检查与安装

#### 1.1 检查 Node.js 版本

```bash
node --version
```

#### 1.2 安装 nvm（如未安装）

```bash
command -v nvm

# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
```

#### 1.3 安装并切换到指定 Node 版本

<!-- TODO: 填写项目要求的 Node.js 版本，示例：Node.js 18.x -->

```bash
# TODO: 替换为项目要求的 Node 版本
nvm install 18
nvm use 18
nvm alias default 18
node --version
```

### 步骤 2: 包管理器安装与配置

<!-- TODO: 填写项目使用的包管理器（pnpm / npm / yarn）及配置，示例（pnpm）：

#### 2.1 检查 pnpm 是否已安装
```bash
pnpm --version
```

#### 2.2 安装 pnpm（如未安装）
```bash
npm install -g pnpm
```

#### 2.3 配置私有源（如有）
```bash
# TODO: 替换为项目使用的私有 npm 源
pnpm config set registry https://registry.npmjs.org
pnpm config get registry
```
-->

### 步骤 3: 项目专属构建工具安装（如有）

<!-- TODO: 如果项目有专属 CLI 工具需要全局安装，在此填写，示例：
```bash
# 检查是否已安装
xxx-cli --version

# 安装
npm install -g @xxx/cli
```
如果项目无专属构建工具，删除本步骤。
-->

### 步骤 4: 项目依赖安装

<!-- TODO: 填写安装命令，示例：pnpm install / npm install -->

```bash
# TODO: 替换为项目实际安装命令
pnpm install
```

### 步骤 5: 环境验证

```bash
node --version

# TODO: 添加项目的验证命令，示例：
pnpm run check
```

## 环境检查清单

- [ ] Node.js 已安装（通过 nvm 管理），版本符合要求
- [ ] 包管理器已安装并配置正确的源
- [ ] 项目依赖已安装
<!-- TODO: 如有专属构建工具，添加对应检查项 -->

## 故障排除

| 问题           | 解决方案                                           |
| -------------- | -------------------------------------------------- |
| nvm 命令找不到 | 执行 `source ~/.zshrc` 重新加载 shell 配置         |
| 私有源访问失败 | 检查网络或 VPN 连接                                |
| 版本冲突       | 检查是否有多个 Node 版本管理工具冲突               |
| 依赖安装失败   | 清理缓存后重试：`pnpm store prune && pnpm install` |

## 禁止行为

- ❌ 不经用户确认直接执行安装命令
- ❌ 跳过环境版本检查
- ❌ 使用项目不支持的包管理器
