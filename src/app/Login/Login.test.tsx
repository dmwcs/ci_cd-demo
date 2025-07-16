import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../../hooks/useAuth';
import { mockFetchData } from '../../utils/mockDataFetch';

// Mock dependencies
vi.mock('../../utils/mockDataFetch');
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid='navigate' data-to={to} />
    ),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Login Component', () => {
  const mockFetchDataMock = vi.mocked(mockFetchData);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Form Validation', () => {
    test('shows validation errors for empty fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const submitButton = screen.getByText('Log in');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    test('shows validation error for short username', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'ab');

      await waitFor(() => {
        expect(
          screen.getByText('Username must be at least 3 characters'),
        ).toBeInTheDocument();
      });
    });

    test('shows validation error for short password', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, '12345');

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 6 characters'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Login Flow', () => {
    test('successfully logs in with valid credentials', async () => {
      const user = userEvent.setup();
      mockFetchDataMock.mockResolvedValue({
        token: 'mock-token',
        user: 'admin',
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Log in');

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetchDataMock).toHaveBeenCalledWith('/login', {
          username: 'admin',
          password: '888888',
        });
      });

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'token',
          'mock-token',
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'username',
          'admin',
        );
      });
    });

    test('shows error message for invalid credentials', async () => {
      const user = userEvent.setup();
      mockFetchDataMock.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Log in');

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    test('shows loading state during login', async () => {
      const user = userEvent.setup();
      mockFetchDataMock.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Log in');

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      expect(screen.getByText('Logging in...')).toBeInTheDocument();
      // Check for button in loading state
      const button = screen.getByText('Logging in...').closest('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Authentication State', () => {
    test('redirects to pump page if already authenticated', () => {
      localStorageMock.setItem('token', 'existing-token');
      localStorageMock.setItem('username', 'existing-user');

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute(
        'data-to',
        '/pump',
      );
    });
  });

  describe('Form Accessibility', () => {
    test('has proper form labels and controls', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Log in' }),
      ).toBeInTheDocument();
    });

    test('disables form during submission', async () => {
      const user = userEvent.setup();
      mockFetchDataMock.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Log in');

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
