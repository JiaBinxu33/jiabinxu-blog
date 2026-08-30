# 工作流模式

## 顺序型工作流（Sequential Workflows）

对于复杂任务，应将操作拆分为清晰的顺序步骤。通常建议在 SKILL.md 开头就向 AI Agent 给出整个流程总览，例如：

```markdown
填写一个 PDF 表单通常包含以下步骤：

步骤1. 分析表单结构（运行 analyze_form.py）
步骤2. 创建字段映射（编辑 fields.json）
步骤3. 校验字段映射（运行 validate_fields.py）
步骤4. 填充表单（运行 fill_form.py）
步骤5. 校验输出结果（运行 verify_output.py）
```

## 条件分支型工作流（Conditional Workflows）

对于包含分支逻辑的任务，需要在关键决策点上引导 AI Agent：

```markdown
步骤1. 先判断本次修改的类型：
   **是创建新内容？** → 按下方 “创建流程（Creation workflow）” 执行
   **是编辑已有内容？** → 按下方 “编辑流程（Editing workflow）” 执行

步骤2. 创建流程（Creation workflow）：[按步骤列出]
步骤3. 编辑流程（Editing workflow）：[按步骤列出]
```