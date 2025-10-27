/**
 * (工具) 遍历 DOM 节点并高亮匹配的文本
 * @param {HTMLElement} element - 要搜索的 DOM 元素
 * @param {string} query - 要高亮的搜索词
 */
function highlightText(element, query) {
  if (!element || !query) return;

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");

  // 遍历所有子节点
  element.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      // 3 是文本节点
      const text = node.textContent;
      if (regex.test(text)) {
        const tempWrapper = document.createElement("span");
        tempWrapper.innerHTML = text.replace(
          regex,
          '<span class="search-highlight">$1</span>'
        );

        while (tempWrapper.firstChild) {
          node.parentNode.insertBefore(tempWrapper.firstChild, node);
        }
        node.parentNode.removeChild(node);
      }
    } else if (
      node.nodeType === 1 &&
      node.nodeName !== "SCRIPT" &&
      node.nodeName !== "STYLE"
    ) {
      // 1 是元素节点 (跳过 <script> 和 <style>)
      highlightText(node, query);
    }
  });
}

/**
 * (工具) 移除所有旧的高亮
 * @param {HTMLElement} element
 */
function removeHighlights(element) {
  if (!element) return;
  element.querySelectorAll("span.search-highlight").forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
    parent.normalize();
  });
}

/**
 * (工具) 转义正则表达式
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 注册 Vue 路由钩子
 */
export default ({ router, isServer }) => {
  if (isServer) {
    return;
  }
  router.afterEach((to, from) => {
    // 稍作延迟, 确保 VuePress 已完成页面渲染
    setTimeout(() => {
      const query = to.query.search_query;
      const hash = to.hash;
      const content = document.querySelector(".theme-default-content");

      if (!content) return;

      // 1. 始终先移除旧的高亮
      removeHighlights(content);

      if (!query) return; // 如果没有 query, 直接退出

      // 2. (*** 关键修复 ***) 确定高亮范围 (Scope)
      let scopeElements = []; // 要高亮的 DOM 元素数组
      let scrollTarget = null; // 最终要滚动到的高亮词
      let headerElement = null; // hash 对应的 H 标签

      if (hash) {
        // (A) 如果有 HASH (例如 #react-特征)
        headerElement = document.getElementById(hash.substring(1));
        if (headerElement) {
          // 找到了锚点
          scopeElements.push(headerElement); // 1. 高亮标题本身

          let nextElem = headerElement.nextElementSibling;
          // 2. 循环遍历所有兄弟节点, 直到下一个 H 标签
          while (nextElem && !/^H[1-6]$/.test(nextElem.tagName)) {
            scopeElements.push(nextElem);
            nextElem = nextElem.nextElementSibling;
          }
        }
      }

      if (scopeElements.length === 0) {
        // (B) 如果没有 hash, 或者没找到 header, 回退到高亮整个页面
        scopeElements.push(content);
      }

      // 3. 在确定的范围内执行高亮, 并寻找第一个高亮
      scopeElements.forEach((el) => {
        highlightText(el, query);

        // 4. 寻找滚动目标
        if (!scrollTarget) {
          // 检查元素自身是否就是高亮 (不太可能, 但保险)
          if (el.matches && el.matches("span.search-highlight")) {
            scrollTarget = el;
          } else {
            // 寻找子元素
            scrollTarget = el.querySelector("span.search-highlight");
          }
        }
      });

      // 5. 执行滚动
      if (scrollTarget) {
        // 优先: 滚动到本区域内的第一个高亮词
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (headerElement) {
        // 其次: 如果高亮词不在 (例如只匹配了标题), 滚动到 H 标签
        headerElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100); // 300ms 延迟
  });
};
