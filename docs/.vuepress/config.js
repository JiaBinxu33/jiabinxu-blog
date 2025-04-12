const path = require("path");
const fs = require("fs");

module.exports = {
  theme: "@vuepress/theme-default",
  description: "前端开发知识体系",
  base: "/jiabinxu-blog/",

  // 多语言配置（保持原样）
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
    locales: {
      "/": {
        nav: [
          { text: "Home", link: "/" },
          { text: "Css", link: "/css/" },
          { text: "JavaScript", link: "/JavaScript/" },
          { text: "External", link: "https://google.com" },
        ],
        // sidebar: generateSidebar(),
        sidebar: {
          "/html/": [
            { title: "advanced", path: "advanced" },
            { title: "basics", path: "basics" },
            { title: "面试相关", path: "面试" },
          ],
          "/css/": [{ title: "layout", path: "layout" }],
          "/JavaScript/": [{ title: "常见面试手写题", path: "常见面试手写题" }],
        },
      },
      "/en/": {
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Css", link: "/en//css/" },
          { text: "External", link: "https://google.com" },
        ],
        // sidebar: generateSidebar(),
        sidebar: {
          "/en/html/": [
            { title: "advanced", path: "advanced" },
            { title: "basics", path: "basics" },
            { title: "interview", path: "interview" },
          ],
          "/en/css/": [{ title: "layout", path: "layout" }],
          "/en/JavaScript/": [
            {
              title: "Common-written-test-questions",
              path: "Common-written-test-questions",
            },
          ],
        },
      },
    },
  },
};
