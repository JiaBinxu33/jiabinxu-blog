---
description: 开发环境和技术栈规范
---

# 开发环境规范

## 技术栈

<!-- TODO: 填写项目实际技术栈
示例：
- 编程语言：React 18、TypeScript、SCSS
- 包管理器：pnpm（必须存在 pnpm-lock.yaml，禁止 package-lock.json 或 yarn.lock）
- 构建工具：Vite / Webpack / nine
- Node 版本：v18
-->

必须使用 `package.json` 中声明的依赖，禁止引入其他第三方库。

## React 组件规范

以下为通用约定，可根据项目调整：

- 每个文件只允许存在一个 React 组件，单个组件不超过 200 行
- 使用 `function` 关键字定义组件，用 `export default` 导出
- 组件样式使用 `index.module.scss`，放在组件同级目录下
- 使用函数式组件，避免类组件
- 文件后缀使用 `.ts`、`.tsx`，不支持 `.js`、`.jsx`

```tsx
import React from 'react';
import styles from './index.module.scss';

interface IButton {
  onClick: () => void;
}

const MyButton = function (props: IButton) {
  return <div className={styles.btn} onClick={props.onClick}>Click me</div>;
};

export default MyButton;
```

## 兼容性要求

<!-- TODO: 填写项目兼容性目标
示例：
- PC 页面：兼容 Chrome 49 及以上版本
- H5 页面：兼容 Android、iOS、Harmony
- 禁止使用 gap 等低版本浏览器不兼容的 CSS 属性
-->
