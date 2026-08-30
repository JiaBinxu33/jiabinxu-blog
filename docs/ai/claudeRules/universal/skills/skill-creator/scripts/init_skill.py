#!/usr/bin/env python3
"""
Skill 初始化工具 - 基于模版创建新的 skill

用法:
    init_skill.py <skill-name> --path <path> [--resources scripts,references,assets] [--examples]

示例:
    init_skill.py my-new-skill --path skills/public
    init_skill.py my-new-skill --path skills/public --resources scripts,references
    init_skill.py my-api-helper --path skills/private --resources scripts --examples
    init_skill.py custom-skill --path /custom/location
"""

import argparse
import re
import sys
from pathlib import Path

MAX_SKILL_NAME_LENGTH = 64
ALLOWED_RESOURCES = {"scripts", "references", "assets"}

SKILL_TEMPLATE = """---
name: {skill_name}
description: [TODO: 用完整且清晰的说明描述这个 skill 做什么、在什么情况下使用。务必写明「何时使用该 skill」——包括典型场景、相关的文件类型，或者会触发它的任务类型。]
---

# {skill_title}

## Overview

[TODO: 用 1–2 句话说明这个 skill 能做什么]

## Structuring This Skill

[TODO: 请选择最适合该 skill 目标的结构方式。常见模式包括：

**1. Workflow-Based（以工作流为主）**（适合有清晰步骤流程的场景）
- 适用于存在明确「一步一步」操作流程的场景
- 示例：DOCX skill，包含 “工作流决策树” -> “阅读” -> “创建” -> “编辑”
- 推荐结构：## 工作流 -> ## 工作流决策树 -> ## 步骤1 -> ## 步骤2...

**2. Task-Based（以任务为主）**（适合工具集合型 skill）
- 适用于该 skill 提供多种不同操作/能力的情况
- 示例：PDF skill，包含 “快速开始” -> “合并PDF” -> “拆分PDF” -> “提取文本”
- 推荐结构：## 任务 -> ## 快速开始 -> ## 任务类别1 -> ## 任务类别2...

**3. Reference/Guidelines（以规范/参考为主）**（适合标准或规范类内容）
- 适用于品牌规范、编码规范或各类要求文档
- 示例：品牌样式，包含 “品牌指南” -> “颜色” -> “排版” -> “功能”
- 推荐结构：## 规范 -> ## 指南 -> ## 规范 -> ## 使用...

**4. Capabilities-Based（以能力模块为主）**（适合集成多能力系统）
- 适用于该 skill 提供多个相互关联的功能时
- 示例：Product Management，包含 “核心能力” -> 编号列出的能力清单
- 推荐结构：## 能力 -> ## 核心能力 -> ### 1. 功能 -> ### 2. 功能...

上述模式可以按需组合使用。大多数学技能会混合使用这些模式（例如：先用 task-based 组织，再为复杂操作补充 workflow 章节）。

完成后，请删除整个 “Structuring This Skill” 小节——它只是写作指引。]

## [TODO: 根据选定结构，替换为第一个主章节标题]

[TODO: 在这里补充内容。可参考已有 skill 的示例：
- 对技术类 skill：添加代码示例
- 对复杂流程：添加决策树
- 提供贴近实际请求的示例
- 根据需要引用 scripts/templates/references 中的脚本或文档]

## Resources (optional)

仅在确实需要时才创建对应的资源目录。如果不需要任何资源，请删除本章节。

### scripts/

可执行代码（Python/Bash 等），用于直接运行以完成特定操作。

**其他 skill 中的示例：**
- PDF skill: `fill_fillable_fields.py`、`extract_form_field_info.py` —— 用于 PDF 处理的工具
- DOCX skill: `document.py`、`utilities.py` —— 文档处理相关的 Python 模块

**适用场景：** Python 脚本、Shell 脚本或任何直接执行的代码，用于自动化、数据处理或特定操作。

**注意：** 这些脚本既可以被直接执行，也可以被 AI Agent 读取以便修改或调整环境。

### references/

用于加载进上下文的文档与参考资料，用来指导 AI Agent 的思考和流程。

**其他 skill 中的示例：**
- Product management: `communication.md`、`context_building.md` —— 详细的流程与协作指引
- BigQuery: API 参考文档与查询示例
- Finance: 表结构文档、公司策略等

**适用场景：** 深度文档、API 参考、数据库 schema、完整的流程指南，以及任何需要 AI Agent 在工作时查阅的详细信息。

### assets/

不会被直接加载进上下文，而是由 AI Agent 在输出结果里引用使用的文件。

**其他 skill 中的示例：**
- Brand styling: PowerPoint 模板文件（.pptx）、logo 文件
- Frontend builder: HTML/React 模板工程目录
- Typography: 字体文件（.ttf、.woff2）

**适用场景：** 各类模板、样板代码、文档模版、图片、图标、字体等，用于生成最终产物。

---

**注意：不是每个 skill 都需要以上三类资源。**
"""

EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
Example helper script for {skill_name}

这是一个 {skill_name} 的示例辅助脚本，可以直接执行。
请将其替换为实际实现，或在不需要时删除。

下面是其他 skill 中真实脚本的示例：
- pdf/scripts/fill_fillable_fields.py - 用于填充 PDF 表单字段
- pdf/scripts/convert_pdf_to_images.py - 将 PDF 页转换为图片
"""

def main():
    print("This is an example script for {skill_name}")
    # TODO: 在此编写脚本的实际逻辑
    # 例如：数据处理、文件转换、API 调用等。

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# Reference Documentation for {skill_title}

这里是详细参考文档的占位内容。
请将其替换为真实的参考文档，或在不需要时删除。

其他 skill 中真实 reference 文档的示例：
- product-management/references/communication.md —— 全面的沟通与状态更新指引
- product-management/references/context_building.md —— 关于如何收集和构建上下文的深度说明
- bigquery/references/ —— API 参考与查询示例

## 何时使用 Reference 文档

Reference 文档特别适合以下场景：
- 完整的 API 文档
- 详细的工作流指南
- 复杂多步骤流程
- 内容过长，不适合直接放在 SKILL.md 主文档中
- 仅在特定场景才需要查阅的内容

## 结构建议

### API Reference 示例结构
- Overview（概览）
- Authentication（鉴权）
- 各接口与调用示例
- 错误码说明
- 限流与配额

### Workflow Guide 示例结构
- 前置条件（Prerequisites）
- 步骤说明（Step-by-step instructions）
- 常见模式（Common patterns）
- 故障排查（Troubleshooting）
- 最佳实践（Best practices）
"""

EXAMPLE_ASSET = """# Example Asset File

这里是 asset 文件位置的占位说明。
请将其替换为真实的资产文件（模板、图片、字体等），或在不需要时删除。

注意：asset 文件不会被直接加载进上下文，而是由 AI Agent 在生成结果时引用使用。

其他 skill 中真实 asset 文件的示例：
- Brand guidelines: logo.png、slides_template.pptx
- Frontend builder: hello-world/ 目录，内含 HTML/React 模板工程
- Typography: custom-font.ttf、font-family.woff2
- Data: sample_data.csv、test_dataset.json

## 常见 asset 类型

- 模板：.pptx、.docx、项目骨架目录
- 图片：.png、.jpg、.svg、.gif
- 字体：.ttf、.otf、.woff、.woff2
- 样板代码：项目目录、起始文件
- 图标：.ico、.svg
- 数据文件：.csv、.json、.xml、.yaml

注意：这个文件本身只是文本占位符。实际的 asset 可以是任意文件类型。
"""


def normalize_skill_name(skill_name):
    """将 skill 名归一化为小写连字符形式（hyphen-case）。"""
    normalized = skill_name.strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    normalized = normalized.strip("-")
    normalized = re.sub(r"-{2,}", "-", normalized)
    return normalized


def title_case_skill_name(skill_name):
    """将连字符形式的 skill 名转换为用于展示的 Title Case。"""
    return " ".join(word.capitalize() for word in skill_name.split("-"))


def parse_resources(raw_resources):
    if not raw_resources:
        return []
    resources = [item.strip() for item in raw_resources.split(",") if item.strip()]
    invalid = sorted({item for item in resources if item not in ALLOWED_RESOURCES})
    if invalid:
        allowed = ", ".join(sorted(ALLOWED_RESOURCES))
        print(f"[ERROR] 未知的资源类型: {', '.join(invalid)}")
        print(f"   允许的类型: {allowed}")
        sys.exit(1)
    deduped = []
    seen = set()
    for resource in resources:
        if resource not in seen:
            deduped.append(resource)
            seen.add(resource)
    return deduped


def create_resource_dirs(skill_dir, skill_name, skill_title, resources, include_examples):
    for resource in resources:
        resource_dir = skill_dir / resource
        resource_dir.mkdir(exist_ok=True)
        if resource == "scripts":
            if include_examples:
                example_script = resource_dir / "example.py"
                example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
                example_script.chmod(0o755)
                print("[OK] 已创建 scripts/example.py")
            else:
                print("[OK] 已创建 scripts/ 目录")
        elif resource == "references":
            if include_examples:
                example_reference = resource_dir / "api_reference.md"
                example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title))
                print("[OK] 已创建 references/api_reference.md")
            else:
                print("[OK] 已创建 references/ 目录")
        elif resource == "assets":
            if include_examples:
                example_asset = resource_dir / "example_asset.txt"
                example_asset.write_text(EXAMPLE_ASSET)
                print("[OK] 已创建 assets/example_asset.txt")
            else:
                print("[OK] 已创建 assets/ 目录")


def init_skill(skill_name, path, resources, include_examples):
    """
    使用 SKILL.md 模版初始化一个新的 skill 目录。

    参数:
        skill_name: skill 名称
        path: 要创建 skill 目录的路径
        resources: 需要创建的资源子目录
        include_examples: 是否在资源目录中生成示例文件

    返回:
        创建好的 skill 目录路径；出错时返回 None
    """
    # 计算 skill 目录路径
    skill_dir = Path(path).resolve() / skill_name

    # 检查目录是否已存在
    if skill_dir.exists():
        print(f"[ERROR] Skill 目录已存在: {skill_dir}")
        return None

    # 创建 skill 目录
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"[OK] 已创建 skill 目录: {skill_dir}")
    except Exception as e:
        print(f"[ERROR] 创建目录失败: {e}")
        return None

    # 基于模版创建 SKILL.md
    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(skill_name=skill_name, skill_title=skill_title)

    skill_md_path = skill_dir / "SKILL.md"
    try:
        skill_md_path.write_text(skill_content)
        print("[OK] 已创建 SKILL.md")
    except Exception as e:
        print(f"[ERROR] 创建 SKILL.md 失败: {e}")
        return None

    # 如有需要，创建资源目录
    if resources:
        try:
            create_resource_dirs(skill_dir, skill_name, skill_title, resources, include_examples)
        except Exception as e:
            print(f"[ERROR] 创建资源目录失败: {e}")
            return None

    # 输出后续操作提示
    print(f"\n[OK] Skill '{skill_name}' 已成功初始化，目录为: {skill_dir}")
    print("\n后续步骤:")
    print("1. 打开并编辑 SKILL.md，完成其中的 TODO，并完善 description")
    if resources:
        if include_examples:
            print("2. 根据需要修改或删除 scripts/、references/、assets/ 中的示例文件")
        else:
            print("2. 根据需要向 scripts/、references/、assets/ 中添加资源文件")
    else:
        print("2. 如有需要再创建资源目录 (scripts/、references/、assets/)")
    print("3. 准备好后运行校验脚本，检查 skill 结构是否正确")

    return skill_dir


def main():
    parser = argparse.ArgumentParser(
        description="使用 SKILL.md 模版创建一个新的 skill 目录。",
    )
    parser.add_argument("skill_name", help="skill 名（会被归一化为 hyphen-case）")
    parser.add_argument("--path", required=True, help="skill 输出目录")
    parser.add_argument(
        "--resources",
        default="",
        help="以逗号分隔的资源列表: scripts,references,assets",
    )
    parser.add_argument(
        "--examples",
        action="store_true",
        help="在选中的资源目录中生成示例文件",
    )
    args = parser.parse_args()

    raw_skill_name = args.skill_name
    skill_name = normalize_skill_name(raw_skill_name)
    if not skill_name:
        print("[ERROR] skill 名必须至少包含一个字母或数字。")
        sys.exit(1)
    if len(skill_name) > MAX_SKILL_NAME_LENGTH:
        print(
            f"[ERROR] skill 名 '{skill_name}' 过长（{len(skill_name)} 个字符）。"
            f"最大长度为 {MAX_SKILL_NAME_LENGTH} 个字符。"
        )
        sys.exit(1)
    if skill_name != raw_skill_name:
        print(f"提示: 已将 skill 名从 '{raw_skill_name}' 归一化为 '{skill_name}'。")

    resources = parse_resources(args.resources)
    if args.examples and not resources:
        print("[ERROR] 使用 --examples 时必须同时指定 --resources。")
        sys.exit(1)

    path = args.path

    print(f"开始初始化 skill: {skill_name}")
    print(f"   目标路径: {path}")
    if resources:
        print(f"   资源目录: {', '.join(resources)}")
        if args.examples:
            print("   示例文件: 已启用")
    else:
        print("   资源目录: 无（按需再创建）")
    print()

    result = init_skill(skill_name, path, resources, args.examples)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
