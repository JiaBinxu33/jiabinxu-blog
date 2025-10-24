module.exports = {
  theme: "@vuepress/theme-default",
  description: "前端开发知识体系",
  base: "/jiabinxu-blog/",
  head: [
    ["link", { rel: "icon", href: "/R-C.png" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css",
      },
    ],

    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js",
      },
    ],
    [
      "meta",
      {
        name: "algolia-site-verification",
        content: "8AB7B96237F774B9",
      },
    ],
  ],
  // 多语言配置
  locales: {
    "/": {
      lang: "zh-CN",
      title: "贾滨旭的个人技术博客",
      description: "前端开发知识体系",
    },
    // TODO: 英文页面未完成暂时注释多语言入口
    // "/en/": {
    //   lang: "en-US",
    //   title: "Ji Binxu's Personal Technical Blog",
    //   description: "Web Development Knowledge System",
    // },
  },
  themeConfig: {
    search: false,
    logo: "/R-C.png",
    locales: {
      "/": {
        nav: [
          { text: "Html+Css", link: "/Html+Css/" },
          {
            text: "JavaScript",
            items: [
              { text: "JavaScript", link: "/JavaScript/" },
              { text: "常见面试手写题", link: "/JavaScript/常见面试手写题/" },
              {
                text: "JavaScript核心对象",
                link: "/JavaScript/JavaScript核心对象/",
              },
            ],
          },
          {
            text: "React",
            link: "/React/",
          },
          {
            text: "Hooks",
            items: [
              { text: "useState", link: "/React/Hooks/useState/" },
              { text: "useEffect", link: "/React/Hooks/useEffect/" },
              { text: "useRef", link: "/React/Hooks/useRef/" },
              { text: "useContext", link: "/React/Hooks/useContext/" },
              { text: "useMemo", link: "/React/Hooks/useMemo/" },
              { text: "useCallback", link: "/React/Hooks/useCallback/" },
              {
                text: "useMemoVSuseCallback",
                link: "/React/Hooks/useMemoVSuseCallback/",
              },
              {
                text: "useReducer",
                link: "/React/Hooks/useReducer/",
              },
              {
                text: "useSyncExternalStore",
                link: "/React/Hooks/useSyncExternalStore/",
              },
              {
                text: "useActionState",
                link: "/React/Hooks/useActionState/",
              },
            ],
          },
          {
            text: "项目实战",
            items: [
              { text: "nextjs", link: "/project/nextjs/" },
              { text: "前端部署", link: "/project/deploy/" },
              { text: "大文件上传", link: "/project/fileUpload/" },
              { text: "macOS指南", link: "/project/macOS_Guide/" },
              { text: "Next.js国际化方案", link: "/project/nextjs-i18n/" },
              {
                text: "Next.js双token无感刷新",
                link: "/project/nextjs-auth-refresh/",
              },
              {
                text: "Next.js目录深入解读",
                link: "/project/nextjs-dir/",
              },
              {
                text: "flutter环境配置",
                link: "/project/flutter-config/",
              },
              {
                text: "flutter",
                link: "/project/flutter/",
              },
              {
                text: "Chrome调试工具",
                link: "/project/chrome-dev-tools/",
              },
            ],
          },
          // { text: "External", link: "https://google.com" },
        ],
        sidebar: "auto",
        // sidebar: {
        //   "/html/": [
        //     { title: "advanced", path: "advanced" },
        //     { title: "basics", path: "basics" },
        //     { title: "面试相关", path: "面试" },
        //   ],
        //   "/css/": [{ title: "layout", path: "layout" }],
        //   "/JavaScript/": [{ title: "常见面试手写题", path: "常见面试手写题" }],
        // },
      },
      // TODO: 暂时注释多语言入口
      "/en/": {
        nav: [
          { text: "Css", link: "/en/css/" },

          {
            text: "JavaScript",
            items: [
              { text: "JavaScript", link: "/en/JavaScript/" },
              {
                text: "Common-written-test-questions",
                link: "/en/JavaScript/Common-written-test-questions/",
              },
            ],
          },
          {
            text: "React",
            link: "/en/React/",
          },
          // { text: "External", link: "https://google.com" },
        ],
        sidebar: "auto",
        // sidebar: {
        //   "/en/html/": [
        //     { title: "advanced", path: "advanced" },
        //     { title: "basics", path: "basics" },
        //     { title: "interview", path: "interview" },
        //   ],
        //   "/en/css/": [{ title: "layout", path: "layout" }],
        //   "/en/JavaScript/": [
        //     {
        //       title: "Common-written-test-questions",
        //       path: "Common-written-test-questions",
        //     },
        //   ],
        // },
      },
    },
  },
  plugins: [[require("./plugins/generate-search-index")]],
};
