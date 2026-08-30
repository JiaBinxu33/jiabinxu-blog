# Claude Rules 模板库

本目录存放可复用的 Claude Code rules 模板，用于快速为新项目生成 `.claude/rules/` 配置。

## 目录结构

```
claudeRules/
├── README.md                  # 本文件：使用说明 + 提示词
├── universal/                 # 通用规则（直接复制，无需修改）
│   ├── basic.md               # AI Coding 基础行为准则
│   └── naming.md              # 命名规范（React/TS 通用）
└── templates/                 # 项目特定规则模板（需按项目填写）
    ├── environment.md         # 技术栈和开发环境
    ├── directory.md           # 工程目录结构
    ├── component.md           # 组件库使用规范
    ├── style.md               # 样式开发规范
    ├── request.md             # 接口请求规范
    ├── utils.md               # 工具方法使用规范
    ├── lint.md                # 代码质量检查
    ├── test.md                # 单测规范
    ├── log.md                 # 埋点上报规范
    ├── report.md              # 错误/指标上报规范
    ├── business-common.md     # 通用业务知识
    └── business-project.md   # 项目专有业务知识
```

## 使用方式

### 快速开始

1. 在新项目根目录创建 `.claude/rules/` 文件夹
2. 将 `universal/` 下的文件直接复制进去
3. 将 `templates/` 下需要的文件复制进去，按说明填写 `TODO` 部分
4. 根据项目实际情况删除不需要的文件

### 哪些文件必须有

| 文件 | 是否必须 | 说明 |
|------|---------|------|
| `basic.md` | ✅ 必须 | 所有项目都需要 |
| `naming.md` | ✅ 必须 | 所有 React/TS 项目都需要 |
| `environment.md` | ✅ 必须 | 说明项目技术栈 |
| `directory.md` | ✅ 必须 | 说明目录约定 |
| `component.md` | 视情况 | 有 UI 开发则需要 |
| `style.md` | 视情况 | 有样式开发则需要 |
| `request.md` | 视情况 | 有接口调用则需要 |
| `utils.md` | 视情况 | 有工具方法约定则需要 |
| `lint.md` | ✅ 必须 | 有代码质量要求则需要 |
| `test.md` | 视情况 | 有单测要求则需要 |
| `log.md` | 视情况 | 有埋点需求则需要 |
| `report.md` | 视情况 | 有错误上报需求则需要 |
| `business-common.md` | 视情况 | 有复杂业务背景则需要 |
| `business-project.md` | 视情况 | 有项目专有业务名词则需要 |

---

## 为新项目生成 Rules 的提示词

将以下提示词发给 Claude，它会帮你生成完整的 `.claude/rules/` 配置：

---

```
我需要为一个新项目配置 Claude Code 的 .claude/rules/ 规则文件。

项目信息如下：
- 项目名称：[项目名]
- 技术栈：[如 React 18 + TypeScript + SCSS / Vue 3 + TS 等]
- 包管理器：[pnpm / npm / yarn]
- 构建工具：[如 Vite / Webpack / nine 等]
- 组件库：[如 Ant Design / Element Plus / @roo/roo 等，没有则填"无"]
- 请求库：[如 axios / umi-request / 自定义 requestWeb 等]
- 工具方法库：[如 lodash / @utiljs/xxx / 自定义 utils 等]
- 代码检查：[如 ESLint + Prettier / ESLint + Klint 等]
- 单测框架：[如 Jest + @testing-library/react / Vitest 等，没有则填"无"]
- 埋点/监控：[如 无 / 神策 / 自定义 lxReport 等]
- 是否有特定目录结构规范：[有/无，有则描述]
- 是否有业务背景需要说明：[有/无，有则描述核心业务名词]

请参考 /Users/jiabinxu/Desktop/project/claudeRules/ 目录中的模板，
为我生成适合这个项目的 .claude/rules/ 文件集合，
放在 [目标路径，如 /path/to/project/.claude/rules/] 下。

要求：
1. basic.md 和 naming.md 直接使用通用版本
2. 其他文件根据上面的项目信息填写项目特定内容
3. 不适用于本项目的文件（如没有埋点则不生成 log.md）直接跳过
4. 每个文件的 description 字段要准确描述文件内容
```

---

## 各文件职责说明

### universal/basic.md
**职责**：AI Coding 的基础行为准则，控制 Claude 的整体工作方式。  
**核心内容**：按需确认需求、最小化修改、严格按需开发、功能验证等原则。  
**通用性**：100% 通用，任何项目直接使用。

### universal/naming.md
**职责**：统一代码命名风格，消除命名歧义。  
**核心内容**：变量/函数/组件/常量/文件/Hook 的命名规则，含正反例。  
**通用性**：100% 通用（适用于所有 React/TypeScript 项目）。

### templates/environment.md
**职责**：告知 Claude 项目的技术栈约束，避免引入不存在的依赖。  
**核心内容**：技术栈列表、包管理器、React 组件基本写法、兼容性要求。  
**需要填写**：技术栈版本、兼容性目标、组件文件结构约定。

### templates/directory.md
**职责**：告知 Claude 项目的目录约定，确保新文件放在正确位置。  
**核心内容**：工程根目录结构、各子目录用途、禁止修改的配置文件。  
**需要填写**：实际目录树、各目录的用途说明、特殊约束。

### templates/component.md
**职责**：规范 UI 组件的开发方式，强制使用指定组件库。  
**核心内容**：组件库选择规则、查询 API 的方式、组件代码结构、导入顺序。  
**需要填写**：组件库名称和引入方式、查询文档的方法（MCP 工具或文档路径）。

### templates/style.md
**职责**：统一样式开发方式，避免样式冲突和兼容性问题。  
**核心内容**：CSS 方案优先级（Tailwind/Module SCSS）、兼容性限制。  
**需要填写**：项目使用的 CSS 方案、Tailwind 配置文件路径（如有）、特殊兼容性要求。

### templates/request.md
**职责**：规范接口请求的写法，确保使用统一的请求工具。  
**核心内容**：请求工具引入方式、请求写法示例、错误处理、类型定义、Mock 规范。  
**需要填写**：请求库名称和引入路径、请求方法签名、错误处理方式。

### templates/utils.md
**职责**：防止重复造轮子，强制优先查找已有工具方法。  
**核心内容**：工具方法文档位置、查询流程、禁止重复实现的范围。  
**需要填写**：工具方法文档路径、工具包引入方式、示例用法。

### templates/lint.md
**职责**：确保开发完成后必须执行代码质量检查。  
**核心内容**：检查命令、常见规范要求（==/!== 等）、禁止提交报错代码。  
**需要填写**：实际的检查命令、项目特定的 lint 规则。

### templates/test.md
**职责**：规范单测的写法和文件位置。  
**核心内容**：测试框架、文件命名、目录位置、执行命令。  
**需要填写**：测试框架名称、测试文件存放目录、执行命令。

### templates/log.md
**职责**：统一埋点事件上报的实现方式。  
**核心内容**：埋点工具引入方式、文档查询路径、使用示例。  
**需要填写**：埋点工具名称、文档位置、示例代码。

### templates/report.md
**职责**：统一错误/指标上报的实现方式。  
**核心内容**：上报工具引入方式、文档查询路径、使用示例。  
**需要填写**：上报工具名称、文档位置、示例代码。

### templates/business-common.md
**职责**：为 Claude 提供业务背景知识，避免对业务名词产生误解。  
**核心内容**：业务运行环境说明、核心业务名词解释、用户角色说明。  
**需要填写**：项目所属的业务领域、核心名词和解释。

### templates/business-project.md
**职责**：项目级别的专有业务知识，比 business-common 更细。  
**核心内容**：本项目的业务概况、目标用户、核心链路、名词解释。  
**需要填写**：所有内容（高度项目特定）。
