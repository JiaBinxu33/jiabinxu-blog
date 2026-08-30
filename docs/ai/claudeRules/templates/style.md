---
description: CSS/SCSS 样式开发规范，编写样式时参考
---

# 样式开发规范

## CSS 方案优先级

<!-- TODO: 填写项目使用的 CSS 方案和优先级，示例一（有 Tailwind）：
1. 第一优先级：Tailwind CSS（使用前必须查询配置文件 `src/tailwind.config.js` 确认类名有效）
2. 第二优先级：Module SCSS

示例二（纯 SCSS）：
- 统一使用 Module SCSS，禁止全局 CSS
-->

## Module SCSS 使用（通用规范）

优先使用 module scss，避免样式污染：

```scss
/* index.module.scss */
.container {
  height: 100%;
  :global {
    span { text-align: center; }
  }
}
```

```tsx
import styles from './index.module.scss';
<div className={styles.container}>...</div>
```

## 兼容性

<!-- TODO: 填写项目兼容性要求，示例：
- PC 页面：兼容 Chrome 49+
- H5 页面：兼容 Android、iOS
- 禁止使用 gap、grid 等低版本浏览器不兼容的属性
-->
