module.exports = {
  theme: "贾滨旭的个人技术博客",
  description: "前端开发知识体系",
  base: "/jiabinxu-blog/",
  // 多语言配置
  locales: {
    "/zh/": {
      lang: "zh-CN",
      title: "技术博客",
      description: "全栈开发知识体系",
    },
    "/en/": {
      lang: "en-US",
      title: "Ji Binxu's Personal Technical Blog",
      description: "Web Development Knowledge System",
    },
  },
  themeConfig: {
    // 多语言导航栏
    locales: {
      "/zh/": {
        nav: [
          { text: "首页", link: "/zh/" },
          {
            text: "React",
            items: [
              { text: "Hooks", link: "/zh/react/hooks/" },
              { text: "核心概念", link: "/zh/react/core-concepts/" },
            ],
          },
          {
            text: "Git",
            items: [
              { text: "基础", link: "/zh/git/basic/" },
              { text: "高级", link: "/zh/git/advanced/" },
            ],
          },
          { text: "语言", link: "/en/" },
        ],
      },
      "/en/": {
        nav: [
          { text: "Home", link: "/en/" },
          {
            text: "React",
            items: [
              { text: "Hooks", link: "/en/react/hooks/" },
              { text: "Core Concepts", link: "/en/react/core-concepts/" },
            ],
          },
          {
            text: "Git",
            items: [
              { text: "Basic", link: "/en/git/basic/" },
              { text: "Advanced", link: "/en/git/advanced/" },
            ],
          },
          { text: "中文", link: "/zh/" },
        ],
      },
    },

    // 自动生成侧边栏
    sidebar: {
      "/zh/react/hooks/": autoSidebarConfig("zh/react/hooks"),
      "/en/react/hooks/": autoSidebarConfig("en/react/hooks"),
      "/zh/git/": autoSidebarConfig("zh/git"),
      "/en/git/": autoSidebarConfig("en/git"),
    },

    // 其他插件配置
    plugins: [["@vuepress/back-to-top"], ["@vuepress/medium-zoom"]],
  },
};

// 自动生成侧边栏函数
function autoSidebarConfig(basePath) {
  const fs = require("fs");
  const path = require("path");
  const docsPath = path.join(__dirname, "../..", basePath);

  return fs
    .readdirSync(docsPath)
    .filter((item) => item.endsWith(".md"))
    .map((item) => {
      const name = item.replace(".md", "");
      return {
        title: name.charAt(0).toUpperCase() + name.slice(1),
        path: `/${basePath}/${name}/`,
      };
    });
}
