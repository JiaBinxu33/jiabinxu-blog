# 基于 Next.js 的双 Token 无感刷新认证系统 - 学习笔记

## 🚀 概述

首先 token 分为两种一种是短期的一种是长期的，为什么要分为两个 token 呢，就是因为出于安全性考虑，比如说你单 token 登录，一个 token 过期时间设置为几天，如果被人获取到了这个 token，别人就可以利用这个 token 登录用户的账号，这个 token 也不能设置的太短，如果太短的话用户体验就太差了，你去上个厕所回来就要重新登录了

再说回双 token 登录，短期 token 和长期 token，短期 token 作为真正的 token 去使用所有的请求头都带上这个 token，另外一个长期 token 作为刷新 token，当我们的短期 token 过期的时候我们通过这个 refreshtoken 验证是否真正的过期，没有过期就重新签发一个短期 token 实现无感刷新

双 Token 体系,**两种 Token 的存储位置和方式完全不同**：短期 token 可以存在内存中，长期 token 在服务器中（服务端设置的 HttpOnly Cookie）里，所以前端获取不到这个代码，安全系数高

- **短期 accessToken**：因为它需要被 JavaScript 频繁读取并添加到请求头中，所以通常存储在**客户端的内存**里（比如 React 的 state 或 Vuex/Pinia 中）。这使得它容易受到 XSS 攻击，但因为它生命周期极短，被盗后的危害有限。
- **长期 refreshToken**：它的安全性最高。最佳实践是将其存储在由**服务端设置的 HttpOnly Cookie** 中。
  - `HttpOnly` 属性意味着前端的 JavaScript 代码**完全无法读取**到这个 Cookie。
  - 这样一来，即使网站遭到 XSS 攻击，攻击者的脚本也偷不走 `refreshToken`，从而保证了用户长期会话的安全。

可能遇到的问题：[如果多个请求同时因为 Token 过期而失败，它们会同时触发刷新，造成浪费和冲突。](#第-7-步-处理并发请求-防止重复刷新)

## 第一部分：后端 API 接口搭建

我们在 Next.js 的 App Router 中创建三个核心的 API 接口，用于处理认证流程。

### 第 1 步：用户登录接口 (`/api/auth/login`)

**目的**：验证用户身份，成功后返回 `accessToken`，同时将 `refreshToken` 安全地设置在 `HttpOnly` Cookie 中。

#### 1.1 - 签发两种 Token

```
// 文件: /app/api/auth/login/route.ts
import { sign } from 'jsonwebtoken';

// 假设用户验证成功，用户ID为 1
const userId = 1;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 创建 AccessToken (有效期短，例如15分钟)
const accessToken = sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
// 创建 RefreshToken (有效期长，例如7天)
const refreshToken = sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
```

#### 1.2 - 将 RefreshToken 序列化为安全的 Cookie

```
// 文件: /app/api/auth/login/route.ts
import { serialize } from 'cookie';

const serializedCookie = serialize('refreshToken', refreshToken, {
    httpOnly: true, // 防止JS读取，防御XSS攻击
    secure: process.env.NODE_ENV === 'production', // 只在HTTPS下传输
    sameSite: 'strict', // 严格的同站策略，防御CSRF攻击
    maxAge: 60 * 60 * 24 * 7, // 7天有效期
    path: '/',
});
```

#### 1.3 - 组合成完整接口

```
// 文件: /app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // ... 用户名密码验证逻辑 ...
    // ... 签发 token 和序列化 cookie 的代码 ...

    return NextResponse.json(
        { accessToken }, // 在body中返回accessToken
        {
            status: 200,
            headers: { 'Set-Cookie': serializedCookie }, // 在header中设置cookie
        }
    );
}
```

> 💡 **核心知识点回顾**
>
> - **jsonwebtoken**: 这是一个构建和验证“数字身份证”（JWT）的工具。
>   - `jwt.sign()`: **签发凭证**。它接收用户信息（Payload）、一个绝密的秘钥（Secret Key），生成一个带防伪签名（Signature）的 Token 字符串。这确保了 Token 的内容未经篡改。
>   - `jwt.verify()`: **验证凭证**。它使用**同一个秘钥**来检查 Token 的签名是否正确、是否在有效期内。这是实现**无状态认证**的关键，服务器无需存储 Session 信息。
> - **NextResponse.json()**: 这不是简单的 `JSON.stringify()`。它是一个**完整的 HTTP 响应构造器**。
>   - 它将 JS 对象转换为 JSON 字符串作为**响应体 (Body)**。
>   - **自动设置**关键的 `Content-Type: application/json` **响应头 (Header)**，告知浏览器数据格式。
>   - 它返回一个功能齐全的 `NextResponse` 对象，允许你链式地设置状态码、Cookie (`Set-Cookie`) 和其他自定义 Headers，是构建健壮后端 API 的基石。

### 第 2 步：刷新 Token 接口 (`/api/auth/refresh`)

**目的**：当 `accessToken` 过期时，前端调用此接口，验证 `refreshToken` Cookie，并返回一个新的 `accessToken`。

#### 2.1 - 读取并验证 Cookie

```
// 文件: /app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'RefreshToken 未找到' }, { status: 401 });
    }

    try {
        const decoded = verify(refreshToken, JWT_SECRET) as { userId: number };
        // ... 接 2.2
    } catch (error) {
        return NextResponse.json({ message: '会话无效，请重新登录' }, { status: 401 });
    }
}
```

#### 2.2 - 签发新的 AccessToken

```
// 文件: /app/api/auth/refresh/route.ts
// ... (在 try 块内部)
// 使用从 refreshToken 解码出的用户信息来创建新的 accessToken
const accessToken = sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
return NextResponse.json({ accessToken });
```

### 第 3 步：用户登出接口 (`/api/auth/logout`)

**目的**：让 `refreshToken` Cookie 失效，完成登出。通过返回一个同名、同路径但 `maxAge` 为负数的 Cookie 实现。

```
// 文件: /app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: Request) {
    const serializedCookie = serialize('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: -1, // 关键：设置为负数使其立即过期
    });

    return NextResponse.json(
        { message: '登出成功' },
        {
            status: 200,
            headers: { 'Set-Cookie': serializedCookie },
        }
    );
}
```

## 第二部分：前端认证状态管理 (`"use client"`)

### 第 4 步：创建认证上下文 (AuthContext)

**目的**：创建一个全局状态管理器，让应用中任何组件都能方便地获取认证状态和方法。

```
// 文件: /app/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// ... (接口定义和 Provider/Hook 骨架)
```

### 第 5 步：封装认证请求 (`authFetch`)

**目的**：创建一个 `fetch` 的替代品，它能自动为请求添加 `Authorization` 头，并处理后续的无感刷新。

### 第 6 步：实现核心的无感刷新逻辑

在 `authFetch` 内部捕获 401 错误，调用刷新 API，获取新的 `accessToken`，然后用新 Token **重试**刚才失败的请求。

### 第 7 步：处理并发请求，防止重复刷新

问题：如果多个请求同时因为 Token 过期而失败，它们会同时触发刷新，造成浪费和冲突。

解决方案：使用一个外部变量作为“锁”，确保同一时间只有一个刷新请求在进行，把刷新 Token”这个动作变成一个全员共享的 Promise。

- 当多个请求同时因为过期失败时：第一个失败的请求去真正发请求刷新，并把这个过程存为一个 Promise。其他同时失败的请求过来一看，发现已经有这个 Promise 在运行了，它们就不再发新的请求，而是全部原地 await 等待这同一个 Promise。等这个 Promise 拿到新 Token 结束了，所有等待的请求就直接拿着这个新 Token 各自去重试。

```
// 文件: /app/contexts/AuthContext.tsx

// 在 AuthProvider 组件外部定义一个变量
let refreshTokenPromise: Promise<string | null> | null = null;

// 在 AuthProvider 内部，authFetch 的 401 处理逻辑
if (response.status === 401) {
    if (!refreshTokenPromise) {
        // 如果当前没有正在刷新的请求，则发起一个新的
        refreshTokenPromise = new Promise(async (resolve, reject) => {
            try {
                // ... (执行刷新Token的API调用) ...
                const newAccessToken = '...';
                resolve(newAccessToken);
            } catch (e) {
                reject(e);
            } finally {
                // 结束后，清空Promise，以便下次可以再次触发
                refreshTokenPromise = null;
            }
        });
    }

    try {
        // 等待正在进行的刷新请求完成
        const newAccessToken = await refreshTokenPromise;
        // ... (用 newAccessToken 重试请求) ...
    } catch (e) {
        // 刷新失败，登出
    }
}
```

> 🧠 **深度解析：并发刷新与 Promise 锁模式**
>
> 这是一个极其巧妙的并发控制模式。为什么必须用 `Promise` 而不是简单的布尔值 `isRefreshing`？
>
> - **布尔值的缺陷**: 布尔值只能告知“**是否在刷新**”，但它无法提供一个机制让后来的请求**暂停并等待结果**，也无法**传递最终的结果**（新的 Token）。简单的 `while(isRefreshing)` 会阻塞 JavaScript 主线程，导致页面卡死。
> - **Promise 的完美 çözüm**：
>   1. **状态即是锁**: 一个处于 `pending` 状态的 Promise 本身就是一个完美的“锁”。
>   2. **await 即是等待**: `await` 关键字天生就是用来“暂停”当前函数，等待一个 Promise 完成，并且**不会阻塞主线程**。
>   3. **resolve 即是结果传递**: 当 Promise 被 `resolve(value)` 时，所有 `await` 这个 Promise 的地方都会被唤醒，并拿到这个 `value`。
>
> > 思想升华：发布-订阅模式的精妙应用
>
> > 这个 Promise 锁模式，本质上是**利用 Promise 的原生特性，实现了一次性的、带记忆功能的发布-订阅模式**。
>
> > - **主题**: `refreshTokenPromise` 这个 Promise 对象。
> > - **发布者**: 第一个触发刷新并创建 `new Promise` 的请求。它通过调用 `resolve` 或 `reject` 来“发布”最终结果。
> > - **订阅者**: 所有后来 `await refreshTokenPromise` 的请求。它们“订阅”了这个主题，等待最终结果的通知。
>
> > 这证明了**设计模式是一种思想，而非固定的代码**。通过理解其核心（如解耦），我们可以用各种工具（如 Promise）巧妙地实现它。

## 第三部分：整合与使用

### 第 8 步：全局应用 Provider

将 `AuthProvider` 包裹在根布局 `layout.tsx` 中，使整个应用都能访问到认证状态。

```
// 文件: /app/layout.tsx
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

```

### 第 9 步：在组件中使用

在任何客户端组件中，通过 `useAuth` hook 来获取数据或执行操作。`authFetch` 会在后台自动处理所有 Token 刷新逻辑，实现真正的“无感刷新”。

```
// 文件: /app/dashboard/page.tsx
"use client";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Dashboard() {
    const { authFetch, logout } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                // 使用我们封装好的 authFetch，它会自动处理认证和刷新
                const res = await authFetch('/api/some-protected-data');
                const data = await res.json();
                console.log(data);
            } catch (error) {
                // 刷新失败的错误会在这里被捕获
                console.error(error);
            }
        };
        loadData();
    }, [authFetch]);

    return <button onClick={logout}>登出</button>;
}

```
