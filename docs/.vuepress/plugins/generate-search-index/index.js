// .vuepress/plugins/generate-search-index/index.js
const { fs, path } = require("@vuepress/shared-utils");

function findHeaderIndex(content, header, lastIndex) {
  if (!header || !header.title) {
    return -1;
  }

  // 1. (v7) 清理 header.title (与 v7 逻辑保持一致)
  const cleanedTitle = header.title
    .replace(/[\s\u00A0]+/g, " ") // 清理空格
    .replace(/[`/():.：<>]/g, "") // (v7) 移除标点
    .trim()
    .toLowerCase(); // (v9) 确保转为小写

  // 2. (v9) 构造 *必须* 匹配的 H 标签搜索词, 例如 "## react 的特征"
  // (我们从 DEBUG 4 知道 content 也是小写的)
  const searchPrefix = ("#".repeat(header.level) + " ").toLowerCase();
  const searchTerm = searchPrefix + cleanedTitle;

  // 3. (v9) 在 "清理后" 的 content 中, 查找 '## title'
  let index = content.indexOf(searchTerm, lastIndex);

  // (v9) 增加回退逻辑: 以防万一 H 标签和内容之间没有空格 (例如: ##标题)
  if (index === -1) {
    const searchTermNoSpace =
      "#".repeat(header.level).toLowerCase() + cleanedTitle;
    index = content.indexOf(searchTermNoSpace, lastIndex);
  }

  return index; // 返回 '## ...' 字符串的起始索引
}

module.exports = (options, context) => ({
  name: "generate-search-index-v7", // 升级版本号

  async ready() {
    console.log("[Search-Plugin] 启动 'ready' 钩子 (v7 - 修复标点).");
    const { pages, sourceDir } = context;
    const documents = [];

    for (const page of pages) {
      if (page.path === "/404.html" || !page.title) {
        continue;
      }

      const pageTitle = page.title;

      // (v7) 1. 统一清理逻辑
      // 我们对 strippedContent 也执行 *相同* 的清理
      const strippedContent = page._strippedContent
        ? page._strippedContent
            .toLowerCase()
            .replace(/[`/():.：<>]/g, "") // (新) 移除特殊标点
            .replace(/[\s\u00A0]+/g, " ") // 统一空格
            .trim()
        : "";

      // (v4) 2. 原始文本 (保持不变, 用于截取)
      const originalStrippedContent = page._strippedContent
        ? page._strippedContent.replace(/[\s\u00A0]+/g, " ").trim()
        : "";

      if (!originalStrippedContent) {
        continue;
      }

      const headers = page.headers || [];
      let lastIndex = 0;

      // 1. "引言" (v7)
      if (headers.length > 0) {
        // (v7) 使用 *清理* 过的 content 查找
        const firstHeaderStartIndex = findHeaderIndex(
          strippedContent,
          headers[0],
          0
        );

        if (firstHeaderStartIndex > 0) {
          // (v7) 警告: 这里的索引可能不准, 因为清理后长度变了
          // 但引言的重要性低于内容, 暂时接受这个 trade-off
          // originalStrippedContent
          const introText = originalStrippedContent
            .substring(0, firstHeaderStartIndex)
            .trim();
          if (introText) {
            documents.push({
              id: page.key,
              path: page.path,
              pageTitle: pageTitle,
              headerTitle: null,
              text: introText,
            });
          }
          lastIndex = firstHeaderStartIndex;
        } else if (firstHeaderStartIndex === 0) {
          lastIndex = 0;
        }
      }

      // 2. H 标签循环
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const nextHeader = headers[i + 1];

        // (v7) 使用 *清理* 过的 content 查找
        const startIndex = findHeaderIndex(strippedContent, header, lastIndex);

        if (startIndex === -1) {
          console.warn(
            `[Search-Plugin] 警告 (v7): 在页面 ${page.path} 中, 
             H 标签 "${header.title}" (清理后) 在 _strippedContent (清理后) 中未找到。将跳过。`
          );
          continue;
        }

        // (!!! 关键修复 v7 !!!)
        // 必须使用 *完全相同* 的清理规则来计算 titleEndIndex
        const cleanedTitle = (header.title || "")
          .replace(/[\s\u00A0]+/g, " ")
          .replace(/[`/():.：<>]/g, "")
          .trim()
          .toLowerCase();

        const searchPrefix = ("#".repeat(header.level) + " ").toLowerCase();

        // (v9) 默认 titleEndIndex 是 '## ' + 'title'
        let titleEndIndex =
          startIndex + searchPrefix.length + cleanedTitle.length;

        // (v9) 检查回退逻辑 (即 '##title' 无空格)
        // 我们通过检查 startIndex 处是否有空格来反推
        const actualFoundTerm = strippedContent.substring(
          startIndex,
          startIndex + searchPrefix.length + cleanedTitle.length
        );
        if (!actualFoundTerm.startsWith(searchPrefix)) {
          // 这意味着 findHeaderIndex 命中了无空格的回退逻辑
          const searchPrefixNoSpace = "#".repeat(header.level).toLowerCase();
          titleEndIndex =
            startIndex + searchPrefixNoSpace.length + cleanedTitle.length;
        }
        let endIndex;
        let mustBreak = false;

        if (nextHeader) {
          endIndex = findHeaderIndex(
            // (v7)
            strippedContent,
            nextHeader,
            titleEndIndex
          );

          if (endIndex === -1) {
            // 找不到 *下一个* H 标签
            console.warn(
              `[Search-Plugin] 提示 (v7): 在页面 ${page.path} 中, 
               找到了 H 标签 "${header.title}", 
               但找不到 *下一个* H 标签 "${nextHeader.title}" (清理后)。
               将默认索引到文章末尾。`
            );
            endIndex = strippedContent.length; // (v7) 索引到 *清理后* 字符串的末尾
            mustBreak = true;
          }
        } else {
          endIndex = strippedContent.length; // (v7) 索引到 *清理后* 字符串的末尾
        }

        // (!!! 关键修复 v7 !!!)
        // 截取文本时, 我们必须使用 *清理后* 的 strippedContent
        // 因为 startIndex 和 endIndex 都是基于它的
        // 这意味着搜索结果的文本也会是 *被清理过* 的 (没有标点)
        // 这是一个必须的妥协，为了让索引能 100% 成功
        const sectionText = strippedContent
          .substring(titleEndIndex, endIndex)
          .trim();

        lastIndex = endIndex;

        if (sectionText) {
          documents.push({
            id: `${page.key}#${header.slug}`,
            path: `${page.path}#${header.slug}`,
            pageTitle: pageTitle,
            headerTitle: header.title, // 标题显示原始的
            text: sectionText, // 文本显示清理后的
          });
        }

        // (v5) 修复连锁反应 (保持不变)
        if (mustBreak) {
          break;
        }
      } // 结束 H 标签循环

      // 3. 处理完全没有 H 标签的页面
      if (headers.length === 0 && strippedContent) {
        documents.push({
          id: page.key,
          path: page.path,
          pageTitle: pageTitle,
          headerTitle: null,
          text: strippedContent, // (v7) 使用清理后的文本
        });
      }
    } // 结束 for (const page of pages)

    // ... (文件写入部分保持不变) ...
    const outputDir = path.resolve(sourceDir, ".vuepress/public");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.resolve(outputDir, "search-index.json");
    await fs.writeFile(outputPath, JSON.stringify(documents));

    console.log(
      `[generate-search-index] (v7 - 修复标点) 索引文件已生成: ${outputPath} (共 ${documents.length} 篇文档)`
    );
  },
});
