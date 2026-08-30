---
description: API 接口请求开发规范，开发接口服务层时参考
---

# 接口请求规范

## 请求工具

<!-- TODO: 填写项目使用的请求工具，示例一（axios）：
- 统一使用 axios，从 `src/utils/request.ts` 引入封装后的实例
- 文档：https://axios-http.com/docs/intro

示例二（自定义 requestWeb）：
- 必须使用 requestWeb 工具方法，从 `@common` 引入
- 规范文档：`node_modules/@md/standard-framework/dist/standard/api.md`
-->

## 文件组织（通用）

- 每个接口模块单独一个文件：`services/userService.ts`
- 统一导出：`services/index.ts`

## 请求写法

<!-- TODO: 填写项目实际的请求写法示例，示例：
```tsx
import { request } from '@/utils/request';

export const fetchUserInfo = (params: IUserInfoRequest): Promise<IUserInfoData> =>
  request.get('/api/user/info', { params });

const getUserInfo = async () => {
  try {
    const data = await fetchUserInfo({ userId: 123 });
    setUserInfo(data);
  } catch (error) {
    Toast.show('网络异常');
  }
};
```
-->

## 类型定义（通用）

```typescript
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}
```

## Mock 数据

<!-- TODO: 填写 Mock 文件的存放规则，示例：
Mock 文件路径对应 API 地址：
```
mock/
└── api/
    └── user.json    # 对应 /api/user 接口
```
-->
