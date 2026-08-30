---
name: develop-component
description: 提供组件开发的规范和标准流程，当用户要求开发组件、实现UI、开发页面时使用
---

# 组件开发

## 概述

**核心能力**：
- 分析用户需求和组件详细功能
- 查询组件库，优先复用已有组件
- 设计和开发业务组件

## 工作流程

请严格根据以下工作流程制定 TODOList 并分步骤执行，禁止遗漏步骤，如果有不确认的地方请咨询用户

### 步骤1: 环境识别

通过用户描述或提供的图片判断页面类型，如果信息不足请咨询用户确认。

<!-- TODO: 填写项目支持的端类型和对应组件库，示例（多端项目）：
```
页面类型判断
├── PC 端页面 → 使用 @xxx/pc-ui 组件库
└── H5 端页面 → 使用 @xxx/mobile-ui 组件库
```
如果项目只有单端，直接写明使用的组件库即可。
-->

### 步骤2: 分析组件需求

根据用户输入总结组件需求，包含：
- 组件功能描述和预期交互
- 组件希望支持的入参

### 步骤3: 查询组件库文档

<!-- TODO: 填写项目组件库的查询方式，示例一（有 MCP 工具）：
根据开发场景调用相应的 MCP 工具查询组件库：

| 页面类型 | 组件库 | MCP 工具 |
|---------|--------|---------|
| PC 端 | `@roo/roo` | `roo` |
| H5 端 | `@roo/roo-b-mobile` | `rooh5` |

示例二（无 MCP，查文档）：
直接查阅组件库官方文档：https://xxx.design/components/overview
-->

**检索结果处理**：
- **已支持**：直接使用现有组件，流程结束
- **不支持**：继续步骤4，新增业务组件

### 步骤4: 业务组件开发

根据组件需求设计技术方案：

<!-- TODO: 填写业务组件的存放位置，示例：
- 业务组件位置：`src/projects/[项目名]/components/` 目录
- 目录名为大驼峰，目录下必须包含 `index.tsx` 和 `index.module.scss`
-->

示例组件结构：

```tsx
import React from 'react';
import styles from './index.module.scss';

interface IComponentProps {
  // TODO: 根据实际需求定义 props
}

const ComponentName = function (props: IComponentProps) {
  return <div className={styles.container}>...</div>;
};

export default ComponentName;
```

**编码约束**：
- 添加完整的 TypeScript 类型
- 使用 `index.module.scss` 管理样式，禁止全局 CSS
- 禁止不查询组件库直接编写 UI 组件

### 步骤5: lint 校验

<!-- TODO: 填写项目的 lint 命令，示例：pnpm run check / npm run lint -->

```bash
# TODO: 替换为项目实际 lint 命令
pnpm run check
```

如果存在 lint 错误则进行修复。

## 自检清单

- [ ] 已识别当前开发环境类型
- [ ] 已查询组件库，确认无可复用组件后才新增
- [ ] 未重复实现现有组件
- [ ] 样式已正确引入，无样式冲突
- [ ] TypeScript 类型完整
- [ ] lint 校验通过
