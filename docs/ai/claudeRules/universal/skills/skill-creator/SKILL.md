---
name: wmb-skill-creator
description: 提供skill规范开发指引，当用户要求开发、更新 AgentSkills 时调用（包含 scripts, references, and assets）
---

# Skill Creator

本 skill 为创建有效的 skill 提供指导。

## 关于 Skill

Skill 是模块化、自包含的包，通过提供专业知识、工作流和工具来扩展 AI Agent 的能力。可将它们视为特定领域或任务的「入门指南」——它们将 AI Agent 从通用代理转变为具备模型无法完全拥有的过程性知识的专业代理。

### Skill 提供的内容

1. 专业化工作流 - 针对特定领域的多步骤流程
2. 工具集成 - 处理特定文件格式或 API 的说明
3. 领域专业知识 - 公司特定知识、schema、业务逻辑
4. 捆绑资源 - 用于复杂和重复任务的 scripts、references 和 assets

## 核心原则

### 简洁至上

上下文窗口是公共资源。Skill 与 AI Agent 所需的一切共享上下文窗口：系统提示、对话历史、其他 Skill 的元数据以及实际用户请求。

**默认假设：AI Agent 已经非常聪明。** 只添加 AI Agent 尚不具备的上下文。对每条信息提出质疑：「AI Agent 是否真的需要这个解释？」以及「这段内容是否值得其 token 成本？」

优先使用简洁示例而非冗长解释。

### 设定合适的自由度

根据任务的脆弱性和可变性匹配具体程度：

**高自由度（基于文本的说明）**：当多种方法都有效、决策依赖上下文或启发式指导方法时使用。

**中自由度（伪代码或带参数的 scripts）**：当存在首选模式、允许一定变化或配置影响行为时使用。

**低自由度（具体 scripts、少量参数）**：当操作脆弱且易出错、一致性至关重要或必须遵循特定顺序时使用。

将 AI Agent 想象为探索路径：悬崖边的窄桥需要具体护栏（低自由度），而开阔的田野允许多条路线（高自由度）。

### Skill 的结构

每个 skill 由必需的 SKILL.md 文件和可选的捆绑资源组成：

```
skill-name/
├── SKILL.md (必需)
│   ├── YAML frontmatter 元数据 (必需)
│   │   ├── name: (必需)
│   │   └── description: (必需)
│   └── Markdown 说明 (必需)
└── Bundled Resources (可选)
    ├── scripts/          - 可执行代码 (Python/Bash 等)
    ├── references/       - 按需加载到上下文的文档
    └── assets/           - 用于输出的文件 (模板、图标、字体等)
```

#### SKILL.md（必需）

每个 SKILL.md 包含：

- **Frontmatter**（YAML）：包含 `name` 和 `description` 字段。这些是 AI Agent 用于判断何时使用 skill 的唯一字段，因此清晰全面地描述 skill 是什么以及何时使用非常重要。
- **Body**（Markdown）：使用 skill 的说明和指导。仅在 skill 触发后加载（如有）。

#### 捆绑资源（可选）

##### Scripts（`scripts/`）

用于需要确定性可靠性或反复重写的任务的可执行代码（Python/Bash 等）。

- **何时包含**：当相同代码被反复重写或需要确定性可靠性时
- **示例**：`scripts/rotate_pdf.py` 用于 PDF 旋转任务
- **优势**：Token 高效、确定性、可在不加载到上下文的情况下执行
- **注意**：Scripts 可能仍需要被 AI Agent 读取以进行补丁或环境特定调整

##### References（`references/`）

按需加载到上下文的文档和参考资料，用于指导 AI Agent 的流程和思考。

- **何时包含**：AI Agent 在工作时应参考的文档
- **示例**：`references/finance.md` 用于财务 schema、`references/mnda.md` 用于公司 NDA 模板、`references/policies.md` 用于公司政策、`references/api_docs.md` 用于 API 规范
- **使用场景**：数据库 schema、API 文档、领域知识、公司政策、详细工作流指南
- **优势**：保持 SKILL.md 精简，仅在 AI Agent 确定需要时加载
- **最佳实践**：若文件较大（>10k 词），在 SKILL.md 中包含 grep 搜索模式
- **避免重复**：信息应仅存在于 SKILL.md 或 references 文件中，而非两者。除非是 skill 的核心内容，否则优先将详细信息放在 references 文件中——这样既保持 SKILL.md 精简，又使信息可发现而不占用上下文窗口。SKILL.md 中仅保留必要的流程说明和工作流指导；将详细参考资料、schema 和示例移至 references 文件。

##### Assets（`assets/`）

不打算加载到上下文的文件，而是用于 AI Agent 产生的输出中。

- **何时包含**：当 skill 需要用于最终输出的文件时
- **示例**：`assets/logo.png` 用于品牌资源、`assets/slides.pptx` 用于 PowerPoint 模板、`assets/frontend-template/` 用于 HTML/React 样板、`assets/font.ttf` 用于字体
- **使用场景**：模板、图片、图标、样板代码、字体、被复制或修改的示例文档
- **优势**：将输出资源与文档分离，使 AI Agent 可在不加载到上下文的情况下使用文件

#### 不应包含在 Skill 中的内容

Skill 应仅包含直接支持其功能的必要文件。不要创建多余的文档或辅助文件，包括：

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- 等

Skill 应仅包含 AI agent 完成手头工作所需的信息。不应包含关于创建过程的辅助上下文、设置和测试流程、面向用户的文档等。创建额外的文档文件只会增加混乱。

### 渐进式披露设计原则

Skill 使用三级加载系统来高效管理上下文：

1. **元数据（name + description）** - 始终在上下文中（约 100 词）
2. **SKILL.md body** - skill 触发时（<5k 词）
3. **捆绑资源** - 按 AI Agent 需要（无限制，因为 scripts 可在不读入上下文窗口的情况下执行）

#### 渐进式披露模式

将 SKILL.md body 保持在核心要点且不超过 500 行，以最小化上下文膨胀。接近此限制时将内容拆分到单独文件。将内容拆分到其他文件时，从 SKILL.md 引用它们并清楚描述何时读取非常重要，以确保 skill 的读者知道它们存在以及何时使用。

**关键原则**：当 skill 支持多种变体、框架或选项时，SKILL.md 中仅保留核心工作流和选择指导。将变体特定的细节（模式、示例、配置）移至单独的 reference 文件。

**模式 1：带 references 的高层指南**

```markdown
# PDF 处理

## 快速开始

使用 pdfplumber 提取文本：
[代码示例]

## 高级功能

- **表单填写**：完整指南见 [FORMS.md](FORMS.md)
- **API 参考**：所有方法见 [REFERENCE.md](REFERENCE.md)
- **示例**：常见模式见 [EXAMPLES.md](EXAMPLES.md)
```

AI Agent 仅在需要时加载 FORMS.md、REFERENCE.md 或 EXAMPLES.md。

**模式 2：按领域组织**

对于具有多个领域的 Skill，按领域组织内容以避免加载无关上下文：

```
bigquery-skill/
├── SKILL.md (概览和导航)
└── reference/
    ├── finance.md (收入、计费指标)
    ├── sales.md (商机、管道)
    ├── product.md (API 使用、功能)
    └── marketing.md (活动、归因)
```

当用户询问销售指标时，AI Agent 仅读取 sales.md。

类似地，对于支持多种框架或变体的 skill，按变体组织：

```
cloud-deploy/
├── SKILL.md (工作流 + 提供商选择)
└── references/
    ├── aws.md (AWS 部署模式)
    ├── gcp.md (GCP 部署模式)
    └── azure.md (Azure 部署模式)
```

当用户选择 AWS 时，AI Agent 仅读取 aws.md。

**模式 3：条件性细节**

展示基本内容，链接到高级内容：

```markdown
# DOCX 处理

## 创建文档

使用 docx-js 创建新文档。见 [DOCX-JS.md](DOCX-JS.md)。

## 编辑文档

对于简单编辑，直接修改 XML。

**修订追踪**：见 [REDLINING.md](REDLINING.md)
**OOXML 详情**：见 [OOXML.md](OOXML.md)
```

AI Agent 仅在用户需要这些功能时读取 REDLINING.md 或 OOXML.md。

**重要指南：**

- **避免深层嵌套的 references** - 保持 references 与 SKILL.md 仅一层深度。所有 reference 文件应从 SKILL.md 直接链接。
- **结构化较长的 reference 文件** - 对于超过 100 行的文件，在顶部包含目录，以便 AI Agent 在预览时能看到完整范围。

## Skill 创建流程

Skill 创建涉及以下步骤：

1. 通过具体示例理解 skill
2. 规划可复用的 skill 内容（scripts、references、assets）
3. 初始化 skill（运行 init_skill.py）
4. 编辑 skill（实现资源并编写 SKILL.md）
5. 打包 skill（运行 package_skill.py）
6. 根据实际使用迭代

按顺序执行这些步骤，仅在存在明确理由不适用时跳过。

### Skill 命名

- 仅使用小写字母、数字和连字符；将用户提供的标题规范化为 hyphen-case（例如 "Plan Mode" -> `plan-mode`）。
- skill分为两种类型：框架默认下发的通用skill和业务自定义skill，其中框架默认下发的通用skill命名需要以`wmb-`开头，业务自定义skill需要以`custom-`开头
- 生成名称时，生成不超过 64 个字符的名称（字母、数字、连字符）。
- 优先使用描述动作的简短动词引导短语。
- 当有助于清晰或触发时按工具命名空间（例如 `gh-address-comments`、`linear-address-issue`）。
- skill 文件夹名称与 skill 名称完全一致。

### 步骤 1：通过具体示例理解 Skill

仅当 skill 的使用模式已清晰理解时跳过此步骤。即使在使用现有 skill 时，此步骤仍有价值。

要创建有效的 skill，需清楚理解 skill 将如何使用的具体示例。这种理解可来自直接的用户示例或经用户反馈验证的生成示例。

例如，在构建 image-editor skill 时，相关问题包括：

- 「image-editor skill 应支持哪些功能？编辑、旋转，还有其他吗？」
- 「能否给出一些此 skill 将如何使用的示例？」
- 「我可以想象用户会提出诸如『从此图片中去除红眼』或『旋转此图片』的请求。您还能想到此 skill 的其他使用方式吗？」
- 「用户会说什么来触发此 skill？」

为避免让用户不知所措，避免在单条消息中提出过多问题。从最重要的问题开始，根据需要跟进以提高效果。

当对 skill 应支持的功能有清晰认识时，结束此步骤。

### 步骤 2：规划可复用的 Skill 内容

要将具体示例转化为有效的 skill，通过以下方式分析每个示例：

1. 考虑如何从零开始执行示例
2. 识别在反复执行这些工作流时，哪些 scripts、references 和 assets 会有帮助

示例：在构建 `pdf-editor` skill 以处理「帮我旋转这个 PDF」等查询时，分析显示：

1. 旋转 PDF 每次都需要重写相同代码
2. 在 skill 中存储 `scripts/rotate_pdf.py` script 会有帮助

示例：在设计 `frontend-webapp-builder` skill 以处理「帮我建一个待办应用」或「帮我建一个追踪步数的仪表盘」等查询时，分析显示：

1. 编写前端 webapp 每次都需要相同的 HTML/React 样板
2. 在 skill 中存储包含 HTML/React 项目文件样板的 `assets/hello-world/` 模板会有帮助

示例：在构建 `big-query` skill 以处理「今天有多少用户登录？」等查询时，分析显示：

1. 查询 BigQuery 每次都需要重新发现表 schema 和关系
2. 在 skill 中存储记录表 schema 的 `references/schema.md` 文件会有帮助

要确定 skill 的内容，分析每个具体示例以创建要包含的可复用资源列表：scripts、references 和 assets。

### 步骤 3：初始化 Skill

此时是实际创建 skill 的时候。

仅当正在开发的 skill 已存在且需要迭代或打包时跳过此步骤。此时继续下一步。

从零创建新 skill 时，始终运行 `init_skill.py` script。该 script 方便地生成新的模板 skill 目录，自动包含 skill 所需的一切，使 skill 创建过程更高效可靠。

用法：

```bash
scripts/init_skill.py <skill-name> --path <output-directory> [--resources scripts,references,assets] [--examples]
```

示例：

```bash
scripts/init_skill.py my-skill --path skills/public
scripts/init_skill.py my-skill --path skills/public --resources scripts,references
scripts/init_skill.py my-skill --path skills/public --resources scripts --examples
```

该 script：

- 在指定路径创建 skill 目录
- 生成带有正确 frontmatter 和 TODO 占位符的 SKILL.md 模板
- 根据 `--resources` 可选创建资源目录
- 设置 `--examples` 时可选添加示例文件

初始化后，根据需要自定义 SKILL.md 并添加资源。若使用了 `--examples`，替换或删除占位符文件。

### 步骤 4：编辑 Skill

在编辑（新生成的或现有的）skill 时，记住 skill 是为另一个 AI Agent 实例使用而创建的。包含对 AI Agent 有益且非显而易见的信息。考虑哪些过程性知识、领域特定细节或可复用 assets 能帮助另一个 AI Agent 实例更有效地执行这些任务。

#### 学习经过验证的设计模式

根据 skill 需求查阅以下有用指南：

- **多步骤流程**：见 references/workflows.md 了解顺序工作流和条件逻辑
- **特定输出格式或质量标准**：见 references/output-patterns.md 了解模板和示例模式

这些文件包含有效 skill 设计的既定最佳实践。


```markdown
## 工作流
请严格根据以下工作流程制定 TODOList 并分步骤执行，禁止遗漏步骤，如果有不确认的地方请咨询用户

### 步骤1: xxxx

### 步骤x: xxxx
```

#### 从可复用的 Skill 内容开始

要开始实现，从上述识别的可复用资源开始：`scripts/`、`references/` 和 `assets/` 文件。注意此步骤可能需要用户输入。例如，在实现 `brand-guidelines` skill 时，用户可能需要提供要存储在 `assets/` 中的品牌资源或模板，或要存储在 `references/` 中的文档。

添加的 scripts 必须通过实际运行进行测试，以确保没有 bug 且输出符合预期。若有多个类似 scripts，仅需测试代表性样本以确保它们都能工作，同时平衡完成时间。

若使用了 `--examples`，删除 skill 不需要的任何占位符文件。仅创建实际需要的资源目录。




#### 更新 SKILL.md

**编写指南**：始终使用祈使句/不定式形式。

##### Frontmatter

使用 `name` 和 `description` 编写 YAML frontmatter：

- `name`：skill 名称
- `description`：这是 skill 的主要触发机制，帮助 AI Agent 理解何时使用 skill。
  - 同时包含 Skill 做什么以及何时使用的具体触发条件/上下文。
  - 将所有「何时使用」信息放在此处——而非 body 中。Body 仅在触发后加载，因此 body 中的「何时使用此 Skill」部分对 AI Agent 无帮助。
  - `docx` skill 的示例 description：「全面的文档创建、编辑和分析，支持修订追踪、批注、格式保留和文本提取。当 AI Agent 需要处理专业文档（.docx 文件）时使用：(1) 创建新文档，(2) 修改或编辑内容，(3) 处理修订追踪，(4) 添加批注，或任何其他文档任务」

不要在 YAML frontmatter 中包含任何其他字段。

##### Body

```markdown
## 工作流
请严格根据以下工作流程制定 TODOList 并分步骤执行，禁止遗漏步骤，如果有不确认的地方请咨询用户

### 步骤1: xxxx

### 步骤x: xxxx
```

### 步骤 5：打包 Skill

Skill 开发完成后，必须打包成可分发的 .skill 文件以供用户分享。打包过程会先自动验证 skill 以确保满足所有要求：

```bash
scripts/package_skill.py <path/to/skill-folder>
```

可选输出目录指定：

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

打包 script 将：

1. **验证** skill，自动检查：
   - YAML frontmatter 格式和必需字段
   - Skill 命名规范和目录结构
   - description 完整性和质量
   - 文件组织和资源引用

2. **打包** skill（若验证通过），创建以 skill 命名的 .skill 文件（例如 `my-skill.skill`），包含所有文件并保持正确的目录结构以供分发。.skill 文件是带有 .skill 扩展名的 zip 文件。

若验证失败，script 将报告错误并退出，不创建包。修复任何验证错误后再次运行打包命令。

### 步骤 6：迭代

测试 skill 后，用户可能会请求改进。这通常发生在使用 skill 之后，对 skill 表现有新鲜上下文时。

**迭代工作流：**

1. 在实际任务中使用 skill
2. 注意困难或低效之处
3. 确定 SKILL.md 或捆绑资源应如何更新
4. 实施更改并再次测试
