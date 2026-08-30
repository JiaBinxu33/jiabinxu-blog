---
description: 文件、变量、组件等命名规范（React/TypeScript 通用）
---

# 命名规范

## 基础命名规则

| 类型 | 规则 | 示例 |
|------|------|------|
| 变量/函数 | 小驼峰 | `getRole`、`handleSubmit` |
| 组件/枚举/interface | 大驼峰 | `UserProfile`、`IButton` |
| 常量/枚举值 | 全大写下划线 | `ERROR_CODE`、`MAX_RETRY_COUNT` |
| 样式类名 | 连字号 | `date-container` |
| 组件/项目目录 | 大驼峰 | `UserProfile/`、`Main/` |
| 非组件目录 | 小驼峰 | `projects/`、`commonUtils/` |
| Hook 文件 | `use-` 前缀 | `use-url-params.ts` |
| 单测文件 | `.test.ts/tsx` | `utils.test.ts` |
| 样式文件 | `.module.scss` | `index.module.scss` |

## 具体场景规范

### 布尔值变量
- 使用 `is`、`has`、`can`、`should`、`will` 前缀
- ✅ `isVisible`、`hasPermission`、`canEdit`
- ❌ `flag`、`status`、`visible`

### 函数命名
- 动词开头，描述动作
- ✅ `getUserInfo`、`handleSubmit`、`validateForm`
- ❌ `userInfo`、`form`、`submit`

### 数组变量
- 使用复数形式或描述性名称
- ✅ `userList`、`roleOptions`、`permissionItems`
- ❌ `users`、`roles`、`items`

### 事件处理函数
- 使用 `handle` 前缀
- ✅ `handleClick`、`handleSubmit`、`handleChange`

### 高阶组件
- 使用 `with` 前缀
- ✅ `withUserAuth`、`withPermissionCheck`

## 禁止事项
- 禁止将数字直接作为变量名一部分：❌ `has03085`、`code03085`
- 禁止过度缩写：❌ `usrInfo`、`apiResp`、`cfgData`
- 禁止命名覆盖（避免与已有变量/全局名冲突）
