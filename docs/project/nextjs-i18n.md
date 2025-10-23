# Next.js的一种国际化方案
[原文章链接](https://developer.aliyun.com/article/1644850)


## 具体步骤

- 安装依赖

    ```powershell
    pnpm add next-intl
    ```

- 根目录新建 `messages` 文件夹，并写入对应的国际化文件：

    ```json
    // en.json
    {
    
    "Route":{
    
        "about":"About",
        "dashboard":"Dashboard",
        "system-manage":"System Manage",
        "internationalization":"Internationalization"
    }
    }

    // zh.json
    {
    
    "Route":{
    
        "about":"关于",
        "dashboard":"仪表盘",
        "system-manage":"系统管理",
        "internationalization":"国际化"
    }
    }
    ```

- 根目录的 `next.config.ts` 文件设置插件：

    ```ts
    import type {
        NextConfig } from "next";
    import createNextIntlPlugin from 'next-intl/plugin';

    const withNextIntl = createNextIntlPlugin();

    const nextConfig: NextConfig = {
    };

    export default withNextIntl(nextConfig);
    ```

- 新建 `src/i18n/config.ts` 文件，写入配置：

    ```ts
    export type Locale = (typeof locales)[number];

    export const locales = ['zh', 'en'] as const;
    export const defaultLocale: Locale = 'zh';
    ```

- 新建 `src/i18n/request.ts` 文件，创建一个请求范围的配置对象：

    ```ts
    import {
        getRequestConfig } from 'next-intl/server';

    import {
        getLocale } from '@/i18n';

    export default getRequestConfig(async () => {
    
    const locale = await getLocale();

    return {
    
        locale,
        messages: (await import(`../../messages/${
        locale}.json`)).default,
    };
    });
    ```

- 新建 `src/i18n/index.ts` 文件，用于服务端获取和设置语言

    ```ts
    'use server';

    import {
        cookies } from 'next/headers';

    import {
        defaultLocale, Locale } from '@/i18n/config';

    // In this example the locale is read from a cookie. You could alternatively
    // also read it from a database, backend service, or any other source.
    const COOKIE_NAME = 'NEXT_LOCALE';

    export async function getLocale() {
    
    return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
    }

    export async function setLocale(locale: Locale) {
    
    (await cookies()).set(COOKIE_NAME, locale);
    }
    ```

- `app/layout.tsx` 文件配置 `NextIntlClientProvider`：

    ```ts
    import {
    NextIntlClientProvider} from 'next-intl';
    import {
    getLocale, getMessages} from 'next-intl/server';

    export default async function RootLayout({
    
    children
    }: {
    
    children: React.ReactNode;
    }) {
    
    const locale = await getLocale();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={
    locale}>
        <body>
            <NextIntlClientProvider messages={
    messages}>
            {
    children}
            </NextIntlClientProvider>
        </body>
        </html>
    );
    }
    ```

- 在文件中使用：

    ```ts
    import {
        useTranslations } from 'next-intl';
    export default function Dashboard() {
    
    const t = useTranslations('Route');
    return (
        <h1>
        {
    t('dashboard')}
        </h1>
    );
    }
    ```

## 切换语言

- 新建 `src/components/LangSwitch/index.tsx` 文件：

    ```html
    'use client';

    import { useLocale } from 'next-intl';

    import { Button } from '@/components/ui/button';
    import { setLocale } from '@/i18n';
    import { type Locale, locales } from '@/i18n/config';

    export default function LangSwitch() {
    const [ZH, EN] = locales;
    const locale = useLocale();

    // 切换语言
    function onChangeLang(value: Locale) {
        const locale = value as Locale;
        setLocale(locale);
    }
    return (
        <Button variant="ghost" size="icon" onClick={() => onChangeLang(locale === ZH ? EN : ZH)}>
        {locale === ZH ? '中' : 'EN'}
        <span className="sr-only">Toggle Lang</span>
        </Button>
    );
    }
    ```

- 在需要的位置引入组件：

    ```html
    import LangSwitch from '@/components/LangSwitch';

    <LangSwitch />
    ```