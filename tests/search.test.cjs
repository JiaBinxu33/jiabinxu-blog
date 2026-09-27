const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const MiniSearch = require('minisearch');
const compiler = require('vue-template-compiler');
const source = fs.readFileSync(path.join(__dirname, '../docs/.vuepress/components/MiniSearch.vue'), 'utf8');
const script = compiler.parseComponent(source).script.content
  .replace('import MiniSearch from "minisearch";', '').replace('export default', 'return');
const component = new Function('MiniSearch', script)(MiniSearch);
function instance() {
  const vm = component.data();
  for (const [name, method] of Object.entries(component.methods)) vm[name] = method.bind(vm);
  return vm;
}

test('single Chinese characters and repeated whitespace are searchable', () => {
  const vm = instance();
  vm.searchIndex = [{ id: '1', pageTitle: 'demo', headerTitle: '', text: '中文搜索', path: '/demo' }];
  vm.initMiniSearch();
  for (const query of ['搜', '中  文  搜  索']) {
    vm.searchQuery = query;
    vm.performSearch();
    assert(vm.suggestions.some((item) => item.type === 'result'), query);
  }
});

test('result HTML is escaped, including matches and fallback snippets', () => {
  const vm = instance();
  const result = { path: '/one', pageTitle: '__proto__', headerTitle: '<img src=x>',
    text: '<script>alert(1)</script>', match: {} };
  const suggestions = vm.groupAndHighlightResults([result], 'absent');
  assert.equal(suggestions.length, 2);
  assert(suggestions[1].headerTitle.includes('&lt;img'));
  assert(!suggestions[1].snippet.includes('<script>'));
  assert(vm.highlight('<img>', ['<img>']).includes('&lt;img&gt;'));
});

test('same-title pages remain separate and fuzzy matches appear in snippets', () => {
  const vm = instance();
  const base = { pageTitle: 'same', headerTitle: '', text: 'x '.repeat(100) + 'useEffect',
    match: { useeffect: ['text'] } };
  const results = vm.groupAndHighlightResults([
    { ...base, path: '/one#first' }, { ...base, path: '/two#second' },
  ], 'useEfect');
  assert.equal(results.filter((item) => item.type === 'groupHeader').length, 2);
  assert(results[1].snippet.includes('<span class="highlight-text">useEffect</span>'));
});

test('query typed during loading runs once the index is initialized', async () => {
  const vm = instance();
  vm.$site = { themeConfig: {} };
  vm.searchQuery = 'example';
  vm.loadIndex = async () => {
    vm.searchIndex = [{ id: 1, path: '/example', pageTitle: 'example', text: '' }];
  };
  await component.mounted.call(vm);
  assert(vm.suggestions.some((item) => item.type === 'result'));
});

test('IME Enter confirms input without navigating', () => {
  const vm = instance();
  vm.go = () => assert.fail('unexpected navigation');
  vm.onEnter({ isComposing: true });
  vm.onEnter({ target: { composing: true } });
  vm.onEnter({ target: {}, keyCode: 229 });
});

test('router page without an H1 is indexed and its Chinese phrase is searchable', async () => {
  const markdown = require('@vuepress/markdown')();
  const { extractHeaders, inferTitle } = require('@vuepress/shared-utils');
  const content = fs.readFileSync(path.join(__dirname, '../docs/project/router.md'), 'utf8');
  const headers = extractHeaders(content, ['h2', 'h3'], markdown);
  const sourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-search-'));
  try {
    const plugin = require('../docs/.vuepress/plugins/generate-search-index')({}, {
      sourceDir, markdown,
      pages: [{ key: 'router', path: '/project/router.html', title: inferTitle({}, content), headers, _strippedContent: content }],
    });
    await plugin.ready();
    const vm = instance();
    vm.searchIndex = JSON.parse(fs.readFileSync(path.join(sourceDir, '.vuepress/public/search-index.json'), 'utf8'));
    vm.initMiniSearch();
    vm.searchQuery = '集中式路由表映射';
    vm.performSearch();
    const result = vm.suggestions.find((item) => item.type === 'result');
    assert(result);
    assert.equal(result.path, '/project/router.html#' + headers[0].slug);
    assert(result.snippet.includes('<span class="highlight-text">集中式路由表映射</span>'));
  } finally {
    fs.rmSync(sourceDir, { recursive: true });
  }
});

test('index uses real Markdown headings, including formatted and Setext headings', async () => {
  const markdown = require('@vuepress/markdown')();
  const { extractHeaders } = require('@vuepress/shared-utils');
  const content = '# Page\nIntro\n```md\n## Real\nfake\n```\n## **Real**\nfirst-body\n## [Link](https://example.com)\nsecond-body\n\nSetext\n------\nthird-body\n## Real\nfourth-body';
  const headers = extractHeaders(content, ['h2', 'h3'], markdown);
  const sourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-search-'));
  try {
    const plugin = require('../docs/.vuepress/plugins/generate-search-index')({}, {
      sourceDir, markdown,
      pages: [{ key: 'page', path: '/page', title: 'Page', headers, _strippedContent: content }],
    });
    await plugin.ready();
    const docs = JSON.parse(fs.readFileSync(path.join(sourceDir, '.vuepress/public/search-index.json'), 'utf8'));
    assert.equal(docs.length, 5);
    assert(docs[0].text.includes('fake'));
    ['first-body', 'second-body', 'third-body', 'fourth-body'].forEach((text, i) => {
      assert(docs[i + 1].text.includes(text));
      assert.equal(docs[i + 1].path, '/page#' + headers[i].slug);
      if (i < 3) assert(!docs[i + 1].text.includes(['second-body', 'third-body', 'fourth-body'][i]));
    });
  } finally {
    fs.rmSync(sourceDir, { recursive: true });
  }
});
