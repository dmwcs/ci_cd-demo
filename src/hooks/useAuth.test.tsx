import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from './useAuth';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
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

// Test component to access auth context
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid='user-info'>
        {user ? `${user.username} - ${user.token}` : 'No user'}
      </div>
      <div data-testid='auth-status'>
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button
        onClick={() => login({ token: 'test-token', username: 'testuser' })}
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Test component without AuthProvider (for error testing)
const TestComponentWithoutProvider = () => {
  const auth = useAuth();
  return <div>{auth.user?.username}</div>;
};

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('AuthProvider', () => {
    test('initializes with no user when localStorage is empty', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated',
      );
    });

    test('initializes with user from localStorage', () => {
      // Setup localStorage with existing user data
      localStorageMock.setItem('token', 'existing-token');
      localStorageMock.setItem('username', 'existing-user');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'existing-user - existing-token',
      );
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      );
    });

    test('handles partial localStorage data (only token)', () => {
      localStorageMock.setItem('token', 'only-token');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated',
      );
    });

    test('handles partial localStorage data (only username)', () => {
      localStorageMock.setItem('username', 'only-username');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated',
      );
    });
  });

  describe('login function', () => {
    test('successfully logs in user', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'testuser - test-token',
      );
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      );
    });

    test('saves user data to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        'test-token',
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'username',
        'testuser',
      );
    });

    test('navigates to /pump after successful login', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/pump');
    });
  });

  describe('logout function', () => {
    test('successfully logs out user', async () => {
      const user = userEvent.setup();

      // Setup initial logged-in state
      localStorageMock.setItem('token', 'existing-token');
      localStorageMock.setItem('username', 'existing-user');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      // Verify user is initially logged in
      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'existing-user - existing-token',
      );
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      );

      // Logout
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      // Verify user is logged out
      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated',
      );
    });

    test('removes user data from localStorage', async () => {
      const user = userEvent.setup();

      // Setup initial logged-in state
      localStorageMock.setItem('token', 'existing-token');
      localStorageMock.setItem('username', 'existing-user');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
    });

    test('logout from initially logged-in state', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      // First login
      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      );

      // Then logout
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated',
      );
    });
  });

  describe('isAuthenticated computed property', () => {
    test('returns false when no user', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not authenticated',
      );
    });

    test('returns true when user exists', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      );
    });
  });

  describe('Error Handling', () => {
    test('throws error when useAuth is used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
