# 输出模式（Output Patterns）

当某个 skill 需要稳定、可复用、质量一致的输出格式时，可以使用以下这些模式。

## 模板模式（Template Pattern）

通过给出输出模版，约束输出格式。根据实际需要调整「严格程度」。

**当要求非常严格（例如 API 返回结构、数据格式等）时：**

```markdown
## 报告结构（Report structure）

必须始终使用下面这个完全一致的模版结构：

# [分析标题（Analysis Title）]

## Executive summary
[用一段话概括最重要的结论]

## Key findings
- 结论 1（含支撑数据）
- 结论 2（含支撑数据）
- 结论 3（含支撑数据）

## Recommendations
1. 具体且可执行的建议
2. 具体且可执行的建议
```

**当只需要给出指导性结构（允许根据场景灵活调整）时：**

```markdown
## 报告结构（Report structure）

下面是一个推荐的默认结构，你可以根据实际情况做出适当调整：

# [分析标题（Analysis Title）]

## 概览
[整体概览]

## Key findings
[根据分析结果灵活拆分/调整小节]

## Recommendations
[结合具体上下文给出建议]

可根据不同分析类型，按需增删或重排这些章节。
```

## 示例模式（Examples Pattern）

当输出质量高度依赖「风格示例」时，建议提供输入/输出样例对：

```markdown
## 提交信息格式（Commit message format）

按照下面的示例风格生成 commit message：

**示例 1：**
Input：新增基于 JWT 的用户认证
Output：
```
feat(auth): 实现基于 JWT 的用户认证

新增登录接口和 token 校验中间件
```

**示例 2：**
Input：修复报表中日期显示错误的问题
Output：
```
fix(reports): 修正报表中的日期格式转换

在报表生成过程中统一使用 UTC 时间戳
```

遵循这种风格：type(scope): 简短描述；后面再用一小段详细说明改动细节。
```

示例通常比文字说明更直观，能更清楚地让 AI Agent 理解期望的风格和细节程度。