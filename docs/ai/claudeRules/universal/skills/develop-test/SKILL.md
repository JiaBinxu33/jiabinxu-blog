---
name: develop-test
description: 提供单元测试开发规范和指导，帮助用户编写组件和函数的单测。当用户需要编写单测、测试组件、测试函数、验证功能正确性时使用此 skill
---

# 单元测试开发

## 概述

这个 skill 用于单元测试开发场景，帮助用户编写符合规范的单元测试。

**核心能力**：
- 分析测试需求
- 编写组件/函数/Hooks 单测
- 执行测试验证

## 技术栈

<!-- TODO: 填写项目实际使用的测试框架，示例：
| 工具 | 用途 |
|------|------|
| jest | 测试框架 |
| @testing-library/react | React 组件测试 |
| @testing-library/jest-dom | DOM 断言扩展 |
| @testing-library/user-event | 用户交互模拟 |
-->

## 工作流程

请严格根据以下工作流程制定 TODOList 并分步骤执行，禁止遗漏步骤，如果有不确认的地方请咨询用户

### 步骤1: 分析测试需求

根据用户输入确定：
- 测试目标（组件 / 函数 / hooks）
- 测试场景（正常流程 / 边界情况 / 错误处理）
- 预期行为

### 步骤2: 创建测试文件

<!-- TODO: 填写单测文件存放位置，示例：`src/tests/` 目录下 -->

**文件命名规范**：
- 组件测试：`ComponentName.test.tsx`
- 函数测试：`functionName.test.ts`
- Hooks 测试：`useSomething.test.ts`

### 步骤3: 编写单测代码

#### 组件测试模板

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('expected text')).toBeInTheDocument();
  });

  it('should handle click event', async () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 函数测试模板

```typescript
import { functionName } from '@/utils/functionName';

describe('functionName', () => {
  it('should return expected result', () => {
    expect(functionName(input)).toBe(expectedOutput);
  });

  it('should handle edge case', () => {
    expect(functionName(null)).toBe(fallbackOutput);
  });

  it('should throw error for invalid input', () => {
    expect(() => functionName(invalidInput)).toThrow();
  });
});
```

#### Hooks 测试模板

```typescript
import { renderHook, act } from '@testing-library/react';
import { useSomething } from '@/hooks/useSomething';

describe('useSomething', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useSomething());
    expect(result.current.value).toBe(initialValue);
  });

  it('should update state', () => {
    const { result } = renderHook(() => useSomething());
    act(() => { result.current.setValue(newValue); });
    expect(result.current.value).toBe(newValue);
  });
});
```

### 步骤4: 执行测试验证

<!-- TODO: 填写项目的测试执行命令，示例：pnpm run test / npm test -->

```bash
# TODO: 替换为项目实际测试命令
pnpm run test
```

确保所有测试用例通过。

## 测试最佳实践

- 使用 `describe` 和 `it` 清晰描述测试内容
- `it('should do something when condition', ...)` — 描述预期行为

### 必须覆盖的场景

- ✅ 正常流程（happy path）
- ✅ 边界条件（空值、null、undefined、极值）
- ✅ 错误处理（异常输入）
- ✅ 用户交互（点击、输入）

### 常用断言速查

```typescript
expect(element).toBeInTheDocument();           // 元素存在
expect(element).toHaveTextContent('text');      // 文本内容
expect(element).toHaveAttribute('disabled');    // 属性检查
expect(element).toHaveClass('class-name');      // 类名检查
expect(mockFn).toHaveBeenCalledWith(arg);       // 函数调用参数
expect(value).toEqual(expected);               // 深比较
```

## 自检清单

- [ ] 测试文件放在指定目录下
- [ ] 文件以 `.test.tsx` 或 `.test.ts` 结尾
- [ ] 使用 `describe` 和 `it` 组织测试用例
- [ ] 覆盖正常流程和边界情况
- [ ] 所有测试用例通过
