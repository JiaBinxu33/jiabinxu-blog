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
    logo: "/assets/img/R-C.png",
    nav: [
      {
        text: "External",
        link: "https://google.com",
        target: "_self",
        rel: "",
      },
      { text: "Guide", link: "/guide/", target: "_blank" },
    ],
    locales: {
      "/zh/": {
        sidebar: {
          // React 中文侧边栏
          "/zh/React/": [
            "", // React/README.md
            "React特性",
            {
              title: "Hooks",
              collapsable: true,
              children: ["hooks/useState", "hooks/useEffect"],
            },
          ],

          // CSS 中文侧边栏
          "/zh/Css/": ["", "元素水平垂直居中"],

          // HTML 中文侧边栏
          "/zh/Html/": ["", "浏览器渲染原理"],

          // JavaScript 中文侧边栏
          "/zh/JavaScript/": ["", "promise"],

          // 默认侧边栏（其他页面）
          "/zh/": ["", "about"],
        },
      },

      "/en/": {
        sidebar: {
          // React 英文侧边栏
          "/en/React/": [
            "",
            "core-features",
            {
              title: "Hooks",
              collapsable: true,
              children: ["hooks/use-state", "hooks/use-effect"],
            },
          ],

          // CSS 英文侧边栏
          "/en/Css/": ["", "vertical-center"],

          // HTML 英文侧边栏
          "/en/Html/": ["", "browser-rendering"],

          // JavaScript 英文侧边栏
          "/en/JavaScript/": ["", "promise"],

          // 默认侧边栏（其他页面）
          "/en/": ["", "about"],
        },
      },
    },
  },
};

// ========== 修正后的侧边栏生成逻辑 ==========
function generateSidebarConfig(lang) {
  const langPrefix = `/${lang}/`;
  const basePath = path.join(__dirname, "../..", "docs", lang);
  console.log("Scanning path:", basePath);

  const categories = ["React", "Html", "Css", "JavaScript"]; // 显式指定分类顺序

  return categories
    .map((category) => {
      const categoryPath = path.join(basePath, category);
      if (!fs.existsSync(categoryPath)) return null;

      // 添加分类入口
      const children = [
        {
          title: lang === "zh" ? "概述" : "Overview",
          path: `${langPrefix}${category}/`,
          collapsable: false,
        },
      ];

      // 处理子目录
      fs.readdirSync(categoryPath).forEach((item) => {
        const itemPath = path.join(categoryPath, item);

        if (fs.statSync(itemPath).isDirectory()) {
          const subItems = fs
            .readdirSync(itemPath)
            .filter((file) => file.endsWith(".md"))
            .map((file) => ({
              title: formatTitle(file),
              path: `${langPrefix}${category}/${item}/${file.replace(
                ".md",
                ""
              )}`,
            }));

          children.push({
            title: formatTitle(item),
            collapsable: true,
            children: subItems,
          });
        } else if (item.endsWith(".md") && item !== "README.md") {
          children.push({
            title: formatTitle(item),
            path: `${langPrefix}${category}/${item.replace(".md", "")}`,
          });
        }
      });

      return {
        title: formatTitle(category),
        collapsable: false,
        children,
      };
    })
    .filter(Boolean);
}

// 标题格式化（支持中英文转换）
function formatTitle(str) {
  const titleMap = {
    hoocks: "Hooks",
    react特性: "React Core Features",
    元素水平垂直居中: "Centering Elements",
    浏览器渲染原理: "Browser Rendering",
    promise: "Promise",
  };

  return (
    titleMap[str.toLowerCase()] ||
    str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace(".md", "")
  );
}
