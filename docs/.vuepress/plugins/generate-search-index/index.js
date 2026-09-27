const { fs, path } = require("@vuepress/shared-utils");

module.exports = (options, context) => ({
  name: "generate-search-index",
  async ready() {
    const { pages, sourceDir, markdown } = context;
    const documents = [];
    for (const page of pages) {
      const content = page._strippedContent || "";
      if (page.path === "/404.html" || !page.title || !content) continue;
      // Use VuePress's parser and IDs rather than matching headings in raw text.
      const headers = new Map((page.headers || []).map((header) => [header.slug, header]));
      const sections = markdown.parse(content, {}).filter((token) =>
        token.type === "heading_open" && token.map && headers.has(token.attrGet("id"))
      );
      const lines = content.replace(/\r\n?/g, "\n").split("\n");
      const add = (header, text) => {
        const squashed = text.replace(/[\x60/():.\uff1a<>]/g, "");
        documents.push({
          id: header ? page.key + "#" + header.slug : page.key,
          path: header ? page.path + "#" + header.slug : page.path,
          pageTitle: page.title,
          headerTitle: header ? header.title : null,
          text: text + "\n\n" + squashed,
        });
      };
      const intro = lines.slice(0, sections.length ? sections[0].map[0] : lines.length).join("\n").trim();
      if (intro || !sections.length) add(null, intro);
      sections.forEach((token, index) => {
        const end = sections[index + 1] ? sections[index + 1].map[0] : lines.length;
        add(headers.get(token.attrGet("id")), lines.slice(token.map[1], end).join("\n").trim());
      });
    }
    const outputPath = path.resolve(sourceDir, ".vuepress/public/search-index.json");
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, JSON.stringify(documents));
    console.log("[generate-search-index] Generated " + documents.length + " sections.");
  },
});
