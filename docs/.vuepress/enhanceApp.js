function escapeRegExp(string) {
  return string.replace(/[.*+?^{}()|[\]\\$]/g, "\\$&");
}

function highlightText(element, query) {
  const regex = new RegExp(escapeRegExp(query), "gi");
  // Snapshot nodes before changing the DOM; article text must never become HTML.
  const walker = document.createTreeWalker(element, 4, {
    acceptNode(node) {
      return node.parentElement.closest("script, style, textarea, .search-highlight") ? 2 : 1;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const text = node.textContent;
    const fragment = document.createDocumentFragment();
    let offset = 0;
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(text))) {
      fragment.appendChild(document.createTextNode(text.slice(offset, match.index)));
      const mark = document.createElement("span");
      mark.className = "search-highlight";
      mark.textContent = match[0];
      fragment.appendChild(mark);
      offset = match.index + match[0].length;
    }
    if (!offset) return;
    fragment.appendChild(document.createTextNode(text.slice(offset)));
    node.parentNode.replaceChild(fragment, node);
  });
}

function removeHighlights(element) {
  if (!element) return;
  element.querySelectorAll("span.search-highlight").forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
    parent.normalize();
  });
}

function getQuery(route) {
  const query = route.query.search_query;
  return typeof query === "string" ? query.trim() : "";
}

function highlightArticle(content, route) {
  removeHighlights(content);
  const query = getQuery(route);
  if (!query) return;

  let id = route.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch (error) {
    // Malformed escapes can still be part of a literal element ID.
  }
  const anchor = id && document.getElementById(id);
  const header = anchor && content.contains(anchor) ? anchor : null;
  const scope = [];
  if (header) {
    scope.push(header);
    let next = header.nextElementSibling;
    while (next && !/^H[1-6]$/.test(next.tagName)) {
      scope.push(next);
      next = next.nextElementSibling;
    }
  } else {
    scope.push(content);
  }
  let target = null;
  scope.forEach((element) => {
    highlightText(element, query);
    if (!target) target = element.querySelector(".search-highlight");
  });
  target = target || header;
  if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default ({ Vue, router, isServer }) => {
  if (isServer) return;

  let article = null;
  let frame = null;
  function refresh() {
    if (frame !== null) cancelAnimationFrame(frame);
    Vue.nextTick(() => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        if (!article || article.path !== router.currentRoute.path ||
            !document.documentElement.contains(article.element)) return;
        highlightArticle(article.element, router.currentRoute);
      });
    });
  }

  // Markdown loads asynchronously; mounted signals that the article is ready.
  function registerArticle() {
    if (!this.$el || !this.$el.matches ||
        !this.$el.matches(".theme-default-content")) return;
    if (article && article.element === this.$el && article.path === this.$route.path) return;
    article = { element: this.$el, path: this.$route.path };
    refresh();
  }
  Vue.mixin({
    mounted: registerArticle,
    updated: registerArticle,
    beforeDestroy() {
      if (article && article.element === this.$el) article = null;
    },
  });

  const scrollBehavior = router.options.scrollBehavior;
  const isScrollSync = () => Vue.$vuepress.$get("disableScrollBehavior");
  // VuePress updates the active heading while scrolling using a hash-only URL.
  const replace = router.replace;
  router.replace = function (location, onComplete, onAbort) {
    if (isScrollSync() && getQuery(router.currentRoute) &&
        typeof location === "string" && location.charAt(0) === "#") {
      location = { path: router.currentRoute.path, hash: location,
        query: router.currentRoute.query };
    }
    return replace.call(this, location, onComplete, onAbort);
  };
  router.options.scrollBehavior = function (to, from, savedPosition) {
    if (getQuery(to)) return false;
    return scrollBehavior && scrollBehavior.call(this, to, from, savedPosition);
  };
  router.afterEach(() => {
    if (isScrollSync()) return;
    if (article) removeHighlights(article.element);
    refresh();
  });
  Vue.prototype.$refreshSearchHighlight = refresh;
};
