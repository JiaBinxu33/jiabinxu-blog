---
description: 组件库使用规范和 React 组件开发规范，开发页面/组件时参考
---

# 组件开发规范

## 组件库选择（强制）

<!-- TODO: 填写项目使用的组件库，示例一（单端）：
- 统一使用 `antd`（Ant Design）
- 编码前查阅官方文档：https://ant.design/components/overview-cn

示例二（多端，如美团 Roo）：
| 页面类型 | 组件库 | 查询方式 |
|---------|--------|---------|
| PC 端 | `@roo/roo` | 调用 roo MCP 工具 |
| H5 端 | `@roo/roo-b-mobile` | 调用 rooh5 MCP 工具 |
-->

**编码前必须查询组件库 API，禁止推测用法。**

## 禁止行为
- ❌ 不查询组件库直接编写 UI 组件
- ❌ 仅凭项目示例推测组件用法
- ❌ 重复实现组件库已有的组件

## 组件代码结构（通用）

```tsx
import React from 'react';
import styles from './index.module.scss';

interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

const Component = function ({ title, isVisible = false }: ComponentProps) {
  if (!isVisible) return null;

  const handleClick = () => { /* 处理逻辑 */ };

  return (
    <div className={styles.container}>
      {/* 使用组件库组件 */}
      <button onClick={handleClick}>{title}</button>
    </div>
  );
};

export default Component;
```

## 导入顺序（通用）
1. React 相关
2. 第三方库
3. 组件库
4. 本地组件和工具
5. 样式（放最后）

## 编码检查清单
- [ ] 已查询组件库确认组件用法
- [ ] 未重复实现现有组件
- [ ] 样式文件已正确引入
- [ ] 无样式冲突
