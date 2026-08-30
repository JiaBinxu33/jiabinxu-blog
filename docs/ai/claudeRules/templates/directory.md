---
description: 工程目录结构规范
---

# 工程目录结构规范

## 工程根目录结构

<!-- TODO: 填写项目实际目录树
示例格式：
```
├── package.json
├── tsconfig.json       # 不允许修改
├── .eslintrc.js        # 不允许修改
├── mock/               # mock 数据
├── public/
└── src/
    ├── assets/         # 静态资源
    ├── components/     # 通用组件
    ├── hooks/          # 通用 hooks
    ├── utils/          # 通用工具方法
    ├── constants/      # 全局常量
    ├── tests/          # 单元测试
    └── projects/       # 应用目录
```
-->

## 单个应用（project）目录结构

<!-- TODO: 填写单个子应用的标准目录结构，示例：
```
{project}/
├── pages/          # 页面组件
├── components/     # 业务组件
├── router/         # 路由配置
├── store/          # 状态管理（可选）
├── services/       # 接口请求
├── types/          # 类型定义
├── utils/          # 工具方法
├── constants/      # 常量
├── App.module.scss
├── App.tsx
└── index.tsx
```
-->

## 严格约束

<!-- TODO: 填写项目特定的目录约束，通用约束如下，可直接保留：-->

- `pages/` 和 `components/` 下的组件必须为文件夹，包含 `index.tsx` + `index.module.scss`
- 业务组件放在各 project 的 `components/` 下，不允许跨 project 直接引用

<!-- TODO: 补充项目特定的不可修改文件列表，示例：
- 以下配置文件不允许修改：`tsconfig.json`、`.eslintrc.js`、`jest.config.js`
-->
