---
description: 代码质量检查规范，开发完成后执行
---

# 代码质量规范

## 检查工具

<!-- TODO: 填写项目使用的检查工具，示例：
- TypeScript：`tsconfig.json`
- ESLint：`.eslintrc.js`
- Prettier：`.prettierrc`
-->

**以上配置文件不允许修改。**

## 开发完成后必须执行

<!-- TODO: 填写实际的检查命令，示例：
```zsh
pnpm run check   # 或 npm run lint
```
-->

发现报错立即修复，禁止带报错提交代码。

## 通用规范要求

- 使用 `===` 和 `!==`，禁止 `==` 和 `!=`
- 禁止 `any` 类型，必须有明确类型定义
- 禁止未使用的变量和 import
- 文件后缀使用 `.ts`、`.tsx`，不支持 `.js`、`.jsx`

<!-- TODO: 补充项目特定的 lint 规则 -->
