module.exports = {
  theme: "@vuepress/theme-default",
  description: "前端开发知识体系",
  base: "/jiabinxu-blog/",
  head: [["link", { rel: "icon", href: "/R-C.png" }]],
  // 多语言配置
  locales: {
    "/": {
      lang: "zh-CN",
      title: "贾滨旭的个人技术博客",
      description: "前端开发知识体系",
    },
    "/en/": {
      lang: "en-US",
      title: "Ji Binxu's Personal Technical Blog",
      description: "Web Development Knowledge System",
    },
  },
  themeConfig: {
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
            ],
          },
          {
            text: "项目实战",
            items: [{ text: "nextjs", link: "/project/nextjs/" }],
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
};
