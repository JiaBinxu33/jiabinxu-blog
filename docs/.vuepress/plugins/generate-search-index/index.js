// .vuepress/plugins/generate-search-index/index.js
const { fs, path } = require("@vuepress/shared-utils");

module.exports = (options, context) => ({
  name: "generate-search-index-v3",

  async ready() {
    console.log("[Search-Plugin] 启动 'ready' 钩子 (v3 - 修复引言).");
    const { pages, sourceDir } = context;
    const documents = [];

    for (const page of pages) {
      if (page.path === "/404.html" || !page.title) {
        continue; // 跳过 404 和无标题页面
      }

      const pageTitle = page.title;
      // 确保 _strippedContent 存在
      const strippedContent = page._strippedContent
        ? page._strippedContent.replace(/[\r\n\s]+/g, " ").trim()
        : "";

      if (!strippedContent) {
        continue; // 跳过无内容的页面
      }

      const headers = page.headers || [];
      let lastIndex = 0;

      // 1. (新) 处理第一个 H 标签之前的 "引言" 文本
      if (headers.length > 0) {
        const firstHeaderStartIndex = strippedContent.indexOf(headers[0].title);

        // 确保找到了标题, 并且标题不在开头
        if (firstHeaderStartIndex > 0) {
          const introText = strippedContent
            .substring(0, firstHeaderStartIndex)
            .trim();
          if (introText) {
            documents.push({
              id: page.key, // 使用页面的 base key
              path: page.path, // 路径不带锚点
              pageTitle: pageTitle,
              headerTitle: null, // 引言部分没有 H 标签
              text: introText,
            });
          }
          lastIndex = firstHeaderStartIndex; // 更新索引, 避免重复
        }
      }

      // 2. (现有) 循环处理所有 H 标签
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const nextHeader = headers[i + 1];

        // 从上一个索引位置开始查找, 避免匹配到重复的标题
        const startIndex = strippedContent.indexOf(header.title, lastIndex);
        if (startIndex === -1) continue;

        let endIndex;
        if (nextHeader) {
          // 查找下一个标题的位置
          endIndex = strippedContent.indexOf(nextHeader.title, startIndex);
          if (endIndex === -1) {
            endIndex = strippedContent.length; // 找不到则到末尾
          }
        } else {
          endIndex = strippedContent.length; // 最后一个标题, 到末尾
        }

        const sectionText = strippedContent
          .substring(startIndex, endIndex)
          .trim();
        lastIndex = endIndex; // 更新上一个索引位置

        if (sectionText) {
          documents.push({
            id: `${page.key}#${header.slug}`, // 唯一 ID
            path: `${page.path}#${header.slug}`, // 带锚点的路径
            pageTitle: pageTitle,
            headerTitle: header.title, // H 标签标题
            text: sectionText,
          });
        }
      }

      // 3. (新) 处理完全没有 H 标签的页面
      if (headers.length === 0) {
        documents.push({
          id: page.key,
          path: page.path,
          pageTitle: pageTitle,
          headerTitle: null,
          text: strippedContent,
        });
      }
    } // 结束 for (const page of pages)

    const outputDir = path.resolve(sourceDir, ".vuepress/public");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.resolve(outputDir, "search-index.json");
    await fs.writeFile(outputPath, JSON.stringify(documents));

    console.log(
      `[generate-search-index] (v3) 索引文件已生成: ${outputPath} (共 ${documents.length} 篇文档)`
    );
  },
});
