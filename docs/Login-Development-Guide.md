# 🔐 Login 功能开发指导文档

## 📊 项目概述

这是 **Pump Master Web App** 项目的 Login 功能开发指导文档。本文档遵循项目的迭代开发原则，提供完整的开发路线图和实施指南。

## 🎯 功能目标

完成后的 Login 功能应该具备：

- ✅ 完整的用户认证体验
- ✅ 健壮的错误处理机制
- ✅ 现代化的响应式设计
- ✅ 完整的测试覆盖
- ✅ 符合项目开发规范

## 📋 当前状态分析

### ✅ 已完成功能

- 基础 Login 组件结构
- 表单状态管理 (useState)
- 基础 UI 布局 (React Bootstrap)
- AuthProvider 和 useAuth hook
- 基础测试用例
- mockDataFetch 登录端点

### ❌ 待完成功能

- 表单验证逻辑
- API 集成和错误处理
- 登录成功后的重定向
- 路由保护机制
- UI/UX 优化
- 完整的测试覆盖

## 🗓️ 迭代开发计划

### 📋 任务状态跟踪

- 🔄 **进行中**: 任务 1 - 表单验证
- ⏳ **待开始**: 任务 2-7 按顺序执行

### 📊 进度跟踪

```
任务 1: 表单验证         [🔄 进行中]
任务 2: API 集成         [⏳ 待开始]
任务 3: 错误处理         [⏳ 待开始]
任务 4: 重定向逻辑       [⏳ 待开始]
任务 5: 路由保护         [⏳ 待开始]
任务 6: UI/UX 优化       [⏳ 待开始]
任务 7: 测试完善         [⏳ 待开始]
```

## 🎯 详细任务实施指南

### 任务 1: 表单验证 🔄 进行中

**目标**: 使用 Zod 提供类型安全的表单验证，提升用户体验

**预计时间**: 30-45 分钟

**具体实现**:

```typescript
// 1. 导入 Zod 验证架构和类型
import { z } from 'zod';
import { loginFormSchema, type LoginFormData } from '../../utils/validation';

// 2. 添加错误状态管理
const [errors, setErrors] = useState<{
  username?: string;
  password?: string;
}>({});

// 3. 实现 Zod 验证函数
const validateForm = (): boolean => {
  try {
    // 使用 Zod 验证表单数据
    loginFormSchema.parse(formData);
    setErrors({}); // 清空错误
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 将 Zod 错误转换为表单错误格式
      const newErrors: typeof errors = {};
      error.errors.forEach((err) => {
        if (err.path[0] === 'username') {
          newErrors.username = err.message;
        } else if (err.path[0] === 'password') {
          newErrors.password = err.message;
        }
      });
      setErrors(newErrors);
    }
    return false;
  }
};

// 4. 修改提交逻辑
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  // 继续处理...
};

// 5. 添加错误显示 UI
<Form.Control
  type="text"
  placeholder="Enter your username"
  value={formData.username}
  onChange={e => setFormData({ ...formData, username: e.target.value })}
  isInvalid={!!errors.username}
/>
<Form.Control.Feedback type="invalid">
  {errors.username}
</Form.Control.Feedback>
```

**Zod 验证架构** (已创建在 `src/utils/validation.ts`):

```typescript
import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
```

**验证规则**:

- 用户名：必填，3-50 个字符
- 密码：必填，6-100 个字符
- 类型安全的验证和错误处理

**成功标准**:

- ✅ 空字段显示"必填"错误
- ✅ 用户名少于3个字符显示错误
- ✅ 密码少于6个字符显示错误
- ✅ 验证通过后才允许提交
- ✅ 使用 TypeScript 类型推断

### 任务 2: API 集成

**目标**: 连接前端表单与认证系统

**预计时间**: 45-60 分钟

**具体实现**:

```typescript
import { useAuth } from '../../hooks/useAuth';
import mockDataFetch from '../../utils/mockDataFetch';

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await mockDataFetch('/login', {
        username: formData.username,
        password: formData.password,
      });

      if (response) {
        login({
          token: response.token,
          username: response.user.username,
        });
      }
    } catch (error) {
      setErrors({ username: 'Invalid credentials' });
    } finally {
      setIsLoading(false);
    }
  };
};
```

**关键要点**:

- 导入 useAuth hook
- 导入 mockDataFetch
- 添加 loading 状态
- 实现异步提交逻辑

### 任务 3: 错误处理

**目标**: 提供清晰的错误反馈和加载状态

**预计时间**: 30 分钟

**具体实现**:

```typescript
import { Alert, Spinner } from 'react-bootstrap';

// 添加通用错误状态
const [generalError, setGeneralError] = useState<string>('');

// 错误处理逻辑
const handleLoginError = (error: unknown) => {
  if (error instanceof Error) {
    setGeneralError(error.message);
  } else {
    setGeneralError('Login failed. Please try again.');
  }
};

// UI 中显示错误和加载状态
{generalError && (
  <Alert variant="danger" className="mt-2">
    {generalError}
  </Alert>
)}

<Button type="submit" disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner size="sm" className="me-2" />
      Logging in...
    </>
  ) : (
    'Log in'
  )}
</Button>
```

**错误类型覆盖**:

- 网络错误
- 认证失败
- 服务器错误
- 表单验证错误

### 任务 4: 重定向逻辑

**目标**: 登录成功后自动跳转到主页面

**具体实现**:

```typescript
import { useNavigate, useLocation } from 'react-router';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    // ... 登录逻辑

    if (response) {
      login({
        token: response.token,
        username: response.user.username,
      });
      navigate(from, { replace: true });
    }
  };
};
```

**重定向逻辑**:

- 登录成功后跳转到主页 `/`
- 如果用户是被重定向到登录页的，登录后返回原页面
- 使用 `replace: true` 避免返回到登录页

### 任务 5: 路由保护

**目标**: 防止已登录用户重复登录

**具体实现**:

```typescript
import { useEffect } from 'react';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // 或者显示加载状态
  }

  // ... 其余组件代码
};
```

**保护机制**:

- 检查用户认证状态
- 已登录用户自动重定向到主页
- 避免不必要的登录页面显示

### 任务 6: UI/UX 优化

**目标**: 提升用户体验和视觉效果

**UI 改进计划**:
基于目标代码，将实现：

- 现代化的卡片式布局
- 品牌标识显示 (♦ PumpMaster)
- 更好的间距和视觉层次
- 加载状态的 Spinner 动画
- 测试凭据显示功能

**具体实现**:

```typescript
return (
  <div className="min-vh-100 bg-light d-flex align-items-center">
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="text-center mb-4">
            <h2 className="fw-bold fs-4 mb-0">♦ PumpMaster</h2>
          </div>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h1 className="h3 fw-normal mb-4">Welcome back</h1>
              </div>

              {/* 表单内容 */}

              <div className="text-center mt-4">
                <small className="text-muted">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    Show test credentials
                  </button>
                </small>
              </div>

              {showCredentials && (
                <Alert variant="info" className="mt-3 small">
                  <strong>Test Credentials:</strong><br />
                  Username: admin<br />
                  Password: password123
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);
```

**UX 提升**:

- 加载状态指示器
- 表单验证视觉反馈
- 响应式设计优化
- 键盘导航支持
- 无障碍性改进

### 任务 7: 测试完善

**目标**: 确保功能稳定性和代码质量

**测试用例**:

```typescript
describe('Login Component', () => {
  test('validates form fields using Zod schema', async () => {
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await user.click(submitButton);

    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('validates username length', async () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'ab'); // 少于 3 个字符

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await user.click(submitButton);

    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
  });

  test('validates password length', async () => {
    render(<Login />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, '12345'); // 少于 6 个字符

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await user.click(submitButton);

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockLogin = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });

    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      token: 'mocked-token',
      username: 'testuser',
    });
  });

  test('handles login errors', async () => {
    // 模拟登录失败
    vi.mocked(mockDataFetch).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'wronguser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('redirects authenticated users', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    });

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
```

**测试覆盖**:

- 表单验证
- 成功登录流程
- 错误处理
- 重定向逻辑
- 加载状态
- 用户交互

## 🔧 技术规范

### 📁 文件结构

```
src/
├── app/Login/
│   ├── Login.tsx          # 主组件
│   ├── Login.test.tsx     # 测试文件
│   └── index.ts           # 导出文件
└── utils/
    └── validation.ts      # Zod 验证架构
```

### 🔗 依赖关系

- `useAuth` hook (认证状态管理)
- `mockDataFetch` (API 调用)
- `react-router` (路由导航)
- `react-bootstrap` (UI 组件)
- `zod` (表单验证库)

### 📝 完成标准

每个任务完成后应该：

- ✅ 代码通过 ESLint 检查
- ✅ 所有测试用例通过
- ✅ 功能在浏览器中正常工作
- ✅ 符合项目的 TypeScript 规范
- ✅ 遵循 React Bootstrap 设计系统

## 🔄 开发流程

### 迭代开发原则

1. **一次只做一个任务** - 当前专注于表单验证
2. **每个任务都要测试** - 确保功能正常后再继续
3. **遵循项目规范** - 使用 TypeScript + React Bootstrap
4. **保持代码简洁** - 避免过度复杂化

### 执行流程

1. **启动任务**: 标记任务为 `in_progress`
2. **实现功能**: 按照具体步骤编写代码
3. **测试验证**: 运行测试确保功能正常
4. **标记完成**: 将任务标记为 `completed`
5. **继续下一个**: 重复上述流程

## 🚀 立即行动

### 当前任务：表单验证 🔄

**立即开始**: 让我们现在就开始实现任务 1 的 Zod 表单验证功能！

**具体步骤**:

1. ✅ 已安装 `zod` 依赖
2. ✅ 已创建 `src/utils/validation.ts` 验证架构
3. 修改 `src/app/Login/Login.tsx` 文件，集成 Zod 验证
4. 添加 Zod 验证逻辑和错误处理
5. 测试验证功能是否正常工作
6. 完成后标记任务为 completed，开始任务 2

**准备好开始了吗？** 让我们一步一步地完善 Login 功能！

---

_最后更新：2024年_ | _项目：Pump Master Web App_ | _版本：v1.0_
