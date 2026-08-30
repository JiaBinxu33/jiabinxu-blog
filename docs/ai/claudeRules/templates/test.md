---
description: 单元测试开发规范，编写单测时参考
---

# 单测规范

## 测试框架

<!-- TODO: 填写项目使用的测试框架，示例：
- jest + @testing-library/react + @testing-library/jest-dom
-->

## 文件规范（通用）

- 单测文件命名以 `.test.ts` 或 `.test.tsx` 结尾（不支持 `.spec`）

<!-- TODO: 填写单测文件存放目录，示例：
- 统一放在 `src/tests/` 目录下
-->

## 执行命令

<!-- TODO: 填写测试执行命令，示例：
```zsh
pnpm run test
```
-->

## 示例结构（通用）

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```
