// .vuepress/plugins/generate-search-index/index.js
const { fs, path } = require("@vuepress/shared-utils");

// 辅助函数：转义正则中的特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// (v8) 全新的正则匹配方案，完美解决之前清理标点导致的“长度偏移”问题
function findHeaderMatch(content, header, lastIndex) {
  if (!header || !header.title) return null;

  // 将标点替换为空格（保留原始长度），并包括 [] 以处理 Markdown 链接格式的标题
  const cleanedTitle = header.title.replace(/[`/():.：<>[\]]/g, " ");

  // 允许标题的单词之间存在不规则的空格（解决原始文本和 title 空格不一致的问题）
  const flexTitlePattern = cleanedTitle.trim().split(/\s+/).map(escapeRegExp).join('\\s+');

  const searchPrefix = "#".repeat(header.level);
  // 构造正则：例如匹配 "##\s*promise\s+all"
  const regex = new RegExp(searchPrefix + "\\s*" + flexTitlePattern, "gi");
  regex.lastIndex = lastIndex;

  return regex.exec(content);
}

module.exports = (options, context) => ({
  name: "generate-search-index-v8", // 升级为 v8

  async ready() {
    console.log("[Search-Plugin] 启动 'ready' 钩子 (v8 - 双重搜索支持 & 修复偏移).");
    const { pages, sourceDir } = context;
    const documents = [];

    for (const page of pages) {
      if (page.path === "/404.html" || !page.title) continue;

      const pageTitle = page.title;
      // 取出带有完整标点的纯净 Markdown 原文
      const originalContent = page._strippedContent || "";

      if (!originalContent) continue;

      // (v8) 核心修复：将标点替换为“空格”，并且不压缩空格！
      // 这样 searchableContent 和 originalContent 的字符长度是【完全一致】的！
      const searchableContent = originalContent
        .toLowerCase()
        .replace(/[`/():.：<>[\]]/g, " ");

      const headers = page.headers || [];
      let lastIndex = 0;

      if (headers.length > 0) {
        const firstMatch = findHeaderMatch(searchableContent, headers[0], 0);
        if (firstMatch && firstMatch.index > 0) {
          // 因为长度一致，这里截取出来的绝对是精准的、带有标点的原始前言
          const introTextOriginal = originalContent.substring(0, firstMatch.index).trim();
          // 生成无标点版本，用于兼容 "promiseall" 这种搜索
          const introTextSquashed = introTextOriginal.replace(/[`/():.：<>]/g, "");
          
          if (introTextOriginal) {
            documents.push({
              id: page.key,
              path: page.path,
              pageTitle: pageTitle,
              headerTitle: null,
              // 【核心魔法】：原文和压缩文同时注入
              text: introTextOriginal + "\n\n" + introTextSquashed,
            });
          }
          lastIndex = firstMatch.index;
        } else if (firstMatch && firstMatch.index === 0) {
          lastIndex = 0;
        }
      }

      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const nextHeader = headers[i + 1];

        const match = findHeaderMatch(searchableContent, header, lastIndex);

        if (!match) {
          console.warn(`[Search-Plugin] 警告 (v8): 未找到 H 标签 "${header.title}"`);
          continue;
        }

        const startIndex = match.index;
        const titleEndIndex = startIndex + match[0].length;

        let endIndex;
        if (nextHeader) {
          const nextMatch = findHeaderMatch(searchableContent, nextHeader, titleEndIndex);
          endIndex = nextMatch ? nextMatch.index : originalContent.length;
        } else {
          endIndex = originalContent.length;
        }

        // 精准截取带有原生标点的段落文本
        const sectionTextOriginal = originalContent.substring(titleEndIndex, endIndex).trim();
        // 生成无标点“连体”文本
        const sectionTextSquashed = sectionTextOriginal.replace(/[`/():.：<>]/g, "");

        documents.push({
          id: `${page.key}#${header.slug}`,
          path: `${page.path}#${header.slug}`,
          pageTitle: pageTitle,
          // 标题显示原始带标点的
          headerTitle: header.title,
          // 【核心魔法】：同时存在，全面兼容！
          text: sectionTextOriginal + "\n\n" + sectionTextSquashed,
        });

        lastIndex = endIndex;
      }

      // 处理没有任何 H 标签的纯文本页面
      if (headers.length === 0 && originalContent) {
         const squashed = originalContent.replace(/[`/():.：<>]/g, "");
         documents.push({
          id: page.key,
          path: page.path,
          pageTitle: pageTitle,
          headerTitle: null,
          text: originalContent + "\n\n" + squashed,
        });
      }
    }

    const outputDir = path.resolve(sourceDir, ".vuepress/public");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.resolve(outputDir, "search-index.json");
    await fs.writeFile(outputPath, JSON.stringify(documents));

    console.log(`[generate-search-index] (v8) 索引文件已生成: ${outputPath} (共 ${documents.length} 篇文档)`);
  },
});