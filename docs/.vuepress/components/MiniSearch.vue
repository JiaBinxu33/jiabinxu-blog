<template>
  <div class="search-box">
    <input
      ref="input"
      v-model="searchQuery"
      aria-label="Search"
      :class="{ focused: focused }"
      :placeholder="placeholder"
      :style="searchInputStyle"
      autocomplete="off"
      spellcheck="false"
      @input="performSearch"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="onEnter"
      @keydown.esc="closeDropdown"
      @keyup.up="onUp"
      @keyup.down="onDown"
    />
    <ul
      v-if="showSuggestions"
      class="suggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        :class="{
          'group-header-item': s.type === 'groupHeader',
          'suggestion-item': s.type === 'result',
          focused: s.type === 'result' && i === focusIndex,
        }"
        @mouseenter="s.type === 'result' && focus(i)"
      >
        <!-- 分组标题 (例如: "工具类") -->
        <template v-if="s.type === 'groupHeader'">
          <div class="group-title" v-html="s.title"></div>
        </template>

        <!-- 搜索结果项 -->
        <template v-else-if="s.type === 'result'">
          <a
            :href="$router.resolve({ path: s.path, query: { search_query: searchQuery } }).href"
            @mousedown.prevent
            @click.prevent="go(i)"
          >
            <!-- (新) 层级图标 -->
            <div class="hierarchy-icon">
              <span>#</span>
            </div>
            <!-- (新) 结果内容容器 -->
            <div class="suggestion-content">
              <!-- H 标签标题 (例如: "useCallback") -->
              <div class="header-main-title" v-html="s.headerTitle"></div>
              <!-- 内容片段 -->
              <div v-if="s.snippet" class="snippet" v-html="s.snippet"></div>
            </div>
          </a>
        </template>
      </li>

      <!-- 无结果提示 -->
      <li
        v-if="suggestions.length === 0 && searchQuery"
        class="suggestion-item no-results"
      >
        <span>{{ loading ? "搜索索引加载中…" : loadError ? "搜索索引加载失败，请刷新重试" : "没有找到结果" }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import MiniSearch from "minisearch";

export default {
  name: "MiniSearch",

  data() {
    return {
      miniSearch: null,
      loading: true,
      loadError: false,
      blurTimer: null,
      searchIndex: [],
      searchQuery: "",
      suggestions: [],
      focused: false,
      focusIndex: 0,
      placeholder: "搜索...",
      alignRight: false,
      CJK_REGEX: /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/,
    };
  },

  computed: {
    showSuggestions() {
      return this.focused && (this.suggestions.length > 0 || this.searchQuery.trim());
    },
    searchInputStyle() {
      return {
        "background-image": `url(${this.$withBase("/search.svg")})`,
      };
    },
  },

  async mounted() {
    this.placeholder = this.$site.themeConfig.searchPlaceholder || "搜索...";
    try {
      await this.loadIndex();
      this.initMiniSearch();
      this.performSearch();
    } catch (error) {
      this.loadError = true;
      console.error("[Search] 索引初始化失败:", error);
    } finally {
      this.loading = false;
    }
  },

  beforeDestroy() {
    clearTimeout(this.blurTimer);
  },

  methods: {
    onFocus() {
      clearTimeout(this.blurTimer);
      this.focused = true;
    },
    onEnter(event) {
      if (event.isComposing || event.target.composing || event.keyCode === 229) return;
      event.preventDefault();
      this.go(this.focusIndex);
    },
    async loadIndex() {
      try {
        const response = await fetch(this.$withBase("/search-index.json"));
        if (!response.ok) {
          throw new Error(`Search index fetch failed: ${response.status}`);
        }
        this.searchIndex = await response.json();
        if (!Array.isArray(this.searchIndex)) throw new Error("Invalid search index");
        console.log(
          `[SearchBox Debug] v3 索引已加载, ${this.searchIndex.length} 篇文档.`
        );
      } catch (e) {
        throw e;
      }
    },

    initMiniSearch() {
      if (!this.searchIndex || this.searchIndex.length === 0) {
        console.warn("[SearchBox Debug] 索引为空, MiniSearch 无法初始化.");
        return;
      }
      // --- (这是新增的代码) ---
      // 1. 定义一个正则表达式来匹配 CJK (中日韩) 字符
      const CJK_REGEX = this.CJK_REGEX;
      const SEPARATOR_REGEX =
        /[,\.!?();:"'\[\]{}。\uff0c\uff1a\uff08\uff09\u3001\u3002\u300a\u300b\u201c\u201d\u2018\u2019-]/;

      const WHITESPACE_REGEX = /[\s\r\n]/;

      const tokenize = (text) => {
        if (!text) return [];
        const terms = [];
        let currentTerm = "";
        let currentTermIsCJK = false;

        const pushCurrentTerm = () => {
          if (currentTerm.length === 0) return;

          const termToPush = currentTermIsCJK
            ? currentTerm.replace(/\s/g, "")
            : currentTerm;

          if (termToPush.length === 0) {
            currentTerm = "";
            return;
          }

          if (currentTermIsCJK) {
            terms.push(...termToPush);
            if (termToPush.length > 1) {
              for (let i = 0; i < termToPush.length - 1; i++) {
                const bigram = termToPush.substring(i, i + 2);
                terms.push(bigram);
              }
            }
          } else {
            terms.push(termToPush.toLowerCase());
          }
          currentTerm = "";
        };

        text.split("").forEach((char) => {
          const isCJK = CJK_REGEX.test(char);
          const isSeparator = SEPARATOR_REGEX.test(char); // (现在 - 会是 true)
          const isWhitespace = WHITESPACE_REGEX.test(char);

          if (isSeparator) {
            // 遇到 - 或 , 等硬标点, 立即结算
            pushCurrentTerm();
            currentTermIsCJK = false;
          } else if (isWhitespace) {
            // 遇到空格
            if (currentTerm.length > 0 && !currentTermIsCJK) {
              // 英文词条, 结算
              pushCurrentTerm();
              currentTermIsCJK = false;
            } else if (currentTermIsCJK) {
              // CJK 词条, 暂时保留空格
              currentTerm += char;
            }
            // (如果 currentTerm 为空, 则忽略空格)
          } else if (isCJK) {
            if (currentTerm.length > 0 && !currentTermIsCJK) {
              pushCurrentTerm(); // 推入上一个英文词条
            }
            currentTerm += char;
            currentTermIsCJK = true;
          } else {
            // 英文/数字
            if (currentTerm.length > 0 && currentTermIsCJK) {
              pushCurrentTerm(); // 推入上一个 CJK 词条
            }
            currentTerm += char;
            currentTermIsCJK = false;
          }
        });

        pushCurrentTerm();
        return terms;
      };
      this.miniSearch = new MiniSearch({
        fields: ["pageTitle", "headerTitle", "text"],
        storeFields: ["path", "pageTitle", "headerTitle", "text"],
        tokenize: tokenize,
        searchOptions: {
          boost: { pageTitle: 3, headerTitle: 2, text: 1 },
          prefix: false, // 默认禁用前缀搜索
          fuzzy: false, // 默认禁用模糊搜索
        },
      });

      this.miniSearch.addAll(this.searchIndex);
      console.log("[SearchBox Debug] MiniSearch v3 已初始化.");
    },

    performSearch() {
      if (!this.searchQuery.trim() || !this.miniSearch) {
        this.suggestions = [];
        return;
      }

      try {
        const searchOptions = {
          highlight: true,
          combineWith: "AND", // 对所有搜索都使用 'AND'
        };

        if (!this.CJK_REGEX.test(this.searchQuery)) {
          // *只有*在搜索纯英文时, 才开启 fuzzy 和 prefix
          searchOptions.fuzzy = 0.2;
          searchOptions.prefix = true;
        }

        const searchResults = this.miniSearch.search(
          this.searchQuery,
          searchOptions
        );
        this.suggestions = this.groupAndHighlightResults(
          searchResults,
          this.searchQuery
        );
        this.focusIndex = this.findNextFocusableIndex(-1, "down");
      } catch (e) {
        console.error("[SearchBox Debug] 搜索出错:", e);
        this.suggestions = [];
      }
    },

/**
     * 将搜索结果分组并高亮
     */
    groupAndHighlightResults(results, query) {
      const grouped = new Map();
      results.slice(0, 15).forEach((result) => {
        const pagePath = result.path.split("#")[0];
        // match maps actual matched terms to field names, not character offsets.
        const terms = [query.trim(), ...Object.keys(result.match || {})].filter(Boolean);
        if (!grouped.has(pagePath)) {
          grouped.set(pagePath, { title: this.highlight(result.pageTitle, terms), items: [] });
        }
        const textTerms = Object.keys(result.match || {}).filter(
          (term) => result.match[term].includes("text")
        );
        grouped.get(pagePath).items.push({
          path: result.path,
          headerTitle: this.highlight(result.headerTitle || "概述", terms),
          snippet: this.createSnippet(result.text, query.trim(), textTerms, terms),
        });
      });
      const finalSuggestions = [];
      grouped.forEach(({ title, items }) => {
        finalSuggestions.push({ type: "groupHeader", title });
        items.forEach((item) => finalSuggestions.push({ type: "result", ...item }));
      });
      return finalSuggestions;
    },

    escapeHtml(text) {
      return String(text || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      }[char]));
    },

    highlight(text, terms) {
      text = String(text || "");
      const alternatives = [...new Set(terms)].filter(Boolean)
        .sort((a, b) => b.length - a.length).map(this.escapeRegExp);
      if (!alternatives.length) return this.escapeHtml(text);
      const regex = new RegExp(alternatives.join("|"), "gi");
      let html = "";
      let offset = 0;
      text.replace(regex, (match, index) => {
        html += this.escapeHtml(text.slice(offset, index));
        html += '<span class="highlight-text">' + this.escapeHtml(match) + '</span>';
        offset = index + match.length;
        return match;
      });
      return html + this.escapeHtml(text.slice(offset));
    },

    createSnippet(text, query, textTerms, terms) {
      if (!text || !query) return "";
      const lowerText = text.toLowerCase();
      let position = lowerText.indexOf(query.toLowerCase());
      if (position < 0) {
        const positions = textTerms.map((term) => lowerText.indexOf(term.toLowerCase()))
          .filter((index) => index >= 0);
        position = positions.length ? Math.min(...positions) : 0;
      }
      const start = Math.max(0, position - 40);
      const end = Math.min(text.length, start + Math.max(80, query.length + 40));
      return (start ? "..." : "") + this.highlight(text.slice(start, end), terms) +
        (end < text.length ? "..." : "");
    },

    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },

    // --- (以下为导航方法) ---

    go(i) {
      if (!this.showSuggestions) return;
      const suggestion = this.suggestions[i];
      if (suggestion && suggestion.type === "result") {
        // 在跳转时, 把当前的 searchQuery 作为 URL query 参数传过去
        const destination = {
          path: suggestion.path, // 路径 (例如 /React/Hooks.html#useCallback)
          query: { search_query: this.searchQuery }, // URL 参数 (例如 ?search_query=fiber)
        };
        if (this.$router.resolve(destination).route.fullPath === this.$route.fullPath) {
          this.$refreshSearchHighlight();
        } else {
          this.$router.push(destination);
        }
        this.closeDropdown();
      }
    },

    closeDropdown() {
      this.searchQuery = "";
      this.suggestions = [];
      this.focused = false;
      this.$refs.input.blur();
    },

    onBlur() {
      clearTimeout(this.blurTimer);
      this.blurTimer = setTimeout(() => {
        this.focused = false;
      }, 200);
    },

    onUp() {
      this.focusIndex = this.findNextFocusableIndex(this.focusIndex, "up");
    },

    onDown() {
      this.focusIndex = this.findNextFocusableIndex(this.focusIndex, "down");
    },

    focus(i) {
      this.focusIndex = i;
    },

    unfocus() {
      this.focusIndex = -1;
    },

    /**
     * (工具) 查找下一个可聚焦的项 (跳过分组标题)
     */
    findNextFocusableIndex(currentIndex, direction) {
      if (!this.suggestions.length) return -1;
      const increment = direction === "down" ? 1 : -1;
      let nextIndex = currentIndex + increment;
      while (nextIndex >= 0 && nextIndex < this.suggestions.length) {
        if (this.suggestions[nextIndex].type === "result") {
          return nextIndex;
        }
        nextIndex += increment;
      }
      if (direction === "up" && nextIndex < 0) {
        return this.findNextFocusableIndex(-1, "down");
      }
      if (direction === "down" && nextIndex >= this.suggestions.length) {
        return this.findNextFocusableIndex(this.suggestions.length, "up");
      }
      return currentIndex;
    },
  },
};
</script>

<style lang="stylus">
// 1. 导入默认主题变量
@import '~@vuepress/theme-default/styles/config.styl'

// (新) 定义绿色高亮
$highlight-color = $accentColor

.search-box
  display inline-block
  position relative
  margin-right 1rem
  // 搜索输入框样式 (保持不变)
  input
    cursor text
    width 10rem
    height 2rem
    color lighten($textColor, 25%)
    display inline-block
    border 1px solid darken($borderColor, 10%)
    border-radius 2rem
    font-size 0.9rem
    line-height 2rem
    padding 0 0.5rem 0 2rem
    outline none
    transition all .2s ease
    background-color #fff
    background-position 0.6rem 0.5rem
    background-repeat no-repeat
    background-size 1rem
    &:focus
      cursor auto
      border-color $accentColor

  // 搜索下拉框容器
  .suggestions
    background #f9fafb // (新) 浅灰色背景
    width 30rem
    max-height 70vh
    overflow-y auto
    position absolute
    top 2rem
    right 0
    border 1px solid darken($borderColor, 10%)
    border-radius 6px
    padding 0.4rem // 内边距
    list-style-type none
    box-shadow 0 4px 12px rgba(0,0,0,0.1)
    z-index 100
    &.align-right
      right 0

  // 分组标题 (例如: "工具类")
  .group-header-item
    padding 0.4rem 0.8rem
    font-size 0.85rem
    color lighten($textColor, 40%)
    font-weight 600
    border-bottom 1px solid $borderColor
    margin-bottom 0.4rem // (新) 和下方的卡片组留出间距
    .group-title
      // (新) 绿色高亮
      .highlight-text
        color $highlight-color
        font-weight 600

  // 搜索结果项 (卡片)
  .suggestion-item
    position relative
    line-height 1.4
    margin 0 0 0.4rem 0 // (新) 卡片间距
    border-radius 6px
    cursor pointer
    background #fff // (新) 卡片背景色
    border 1px solid $borderColor // (新) 卡片边框
    box-shadow 0 1px 3px rgba(0,0,0,0.05) // (新) 卡片阴影
    transition border-color .2s ease

    a
      display flex // (新) flex 布局 (图标 + 内容)
      padding 0.6rem 0.8rem // 内边距
      white-space normal
      color lighten($textColor, 35%)

      // (新) 层级图标
      .hierarchy-icon
        flex 0 0 auto
        width 1.5rem
        color lighten($textColor, 50%)
        font-family monospace
        font-size 1.1rem
        span
          display block
          transform scale(0.8) // 使 # 稍小

      // (新) 结果内容容器
      .suggestion-content
        flex 1 1 auto
        min-width 0 // flex 溢出修复

        // H 标签标题 (例如: "useCallback")
        .header-main-title
          font-weight 600
          color $textColor
          font-size 0.9rem
          // (新) 绿色高亮
          .highlight-text
            color $highlight-color
            font-weight 600

        // 内容片段
        .snippet
          font-size 0.8rem
          color #555
          margin-top 4px
          word-break break-all
          line-height 1.3
          // (新) 绿色高亮
          .highlight-text
            color $highlight-color
            font-weight 600

    // 聚焦样式 (键盘或鼠标悬停)
    &.focused
      border-color $accentColor // (新) 边框变绿
      background-color #f9fefc // (新) 极浅的绿色背景
      a
        .header-main-title
          color $accentColor

    // 无结果
    &.no-results
      font-size 0.9rem
      color $textColor
      padding 0.6rem 1.2rem
      text-align center
      cursor default
      margin 0
      border none
      background transparent
      box-shadow none

// --- 响应式样式 (保持不变) ---
@media (max-width: $MQNarrow)
  .search-box
    input
      width 0
      border-color transparent
      position relative
      left 1rem
      &:focus
        width 10rem
        left 0
        border-color $accentColor

@media (max-width: $MQMobile)
  .search-box
    margin-right 0
    input
      left 1rem
    .suggestions
      right 0
      width calc(100vw - 4rem)
</style>
