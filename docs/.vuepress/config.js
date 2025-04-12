const path = require("path"); // 新增这行
const fs = require("fs");
module.exports = {
  theme: "@vuepress/theme-default",
  description: "前端开发知识体系",
  base: "/jiabinxu-blog/",

  // 多语言配置
  locales: {
    "/zh/": {
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
      "/zh/": {
        nav: [
          { text: "Home", link: "/zh/" },
          { text: "en", link: "/en/" },
          { text: "External", link: "https://google.com" },
        ],
        sidebar: {
          "/zh/html/": [
            { title: "advanced", path: "advanced" },
            { title: "basics", path: "basics" },
          ],
          "/zh/css/": ["layout"],
        },
      },
      "/en/": {
        nav: [
          { text: "Home", link: "/en/" },
          { text: "zh", link: "/zh/" },
          { text: "External", link: "https://google.com" },
        ],
        sidebar: {
          "/en/html/": [
            { title: "advanced", path: "advanced" },
            { title: "basics", path: "basics" },
          ],
          "/en/css/": ["layout"],
        },
      },
    },
  },
};
