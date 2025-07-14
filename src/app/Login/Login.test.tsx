import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../../hooks/useAuth';
import * as mockDataFetch from '../../utils/mockDataFetch';

// Mock mockDataFetch
vi.mock('../../utils/mockDataFetch', () => ({
  mockFetchData: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders all elements correctly', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      expect(
        screen.getByRole('heading', { name: /welcome back/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /log in/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /don't have an account\? register/i }),
      ).toBeInTheDocument();
    });

    test('form fields start empty', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      expect(screen.getByLabelText(/username/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
    });
  });

  describe('Form Input', () => {
    test('allows typing in username and password fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');

      expect(usernameInput).toHaveValue('admin');
      expect(passwordInput).toHaveValue('888888');
    });

    test('disables form fields during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(mockDataFetch.mockFetchData).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    test('shows validation errors for empty fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(screen.getByText(/Username is required/)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/)).toBeInTheDocument();
    });

    test('shows validation error for short username', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'ab');
      await user.tab(); // Trigger validation

      await waitFor(() => {
        expect(
          screen.getByText(/Username must be at least 3 characters/),
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

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, '123');
      await user.tab(); // Trigger validation

      await waitFor(() => {
        expect(
          screen.getByText(/Password must be at least 6 characters/),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Login Functionality', () => {
    test('successful login with correct credentials', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        token: 'mocked-token-admin',
        user: { username: 'admin' },
      };

      vi.mocked(mockDataFetch.mockFetchData).mockResolvedValue(mockResponse);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockDataFetch.mockFetchData).toHaveBeenCalledWith('/login', {
          username: 'admin',
          password: '888888',
        });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/pump');
      });
    });

    test('shows loading state during login', async () => {
      const user = userEvent.setup();
      vi.mocked(mockDataFetch.mockFetchData).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
      expect(
        screen.getByText(/logging in.../i).querySelector('.spinner-border'),
      ).toBeInTheDocument();
    });

    test('displays error for invalid credentials', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid username or password';

      vi.mocked(mockDataFetch.mockFetchData).mockRejectedValue(
        new Error(errorMessage),
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Error should be displayed in an alert
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('displays generic error for unexpected errors', async () => {
      const user = userEvent.setup();

      vi.mocked(mockDataFetch.mockFetchData).mockRejectedValue(
        'Unexpected error',
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('there is something wrong'),
        ).toBeInTheDocument();
      });
    });

    test('clears error message on new submission', async () => {
      const user = userEvent.setup();

      // First submission with error
      vi.mocked(mockDataFetch.mockFetchData).mockRejectedValueOnce(
        new Error('Invalid username or password'),
      );

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Invalid username or password'),
        ).toBeInTheDocument();
      });

      // Second submission should clear error
      vi.mocked(mockDataFetch.mockFetchData).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      );

      await user.clear(usernameInput);
      await user.clear(passwordInput);
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Invalid username or password'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles malformed API response', async () => {
      const user = userEvent.setup();

      vi.mocked(mockDataFetch.mockFetchData).mockResolvedValue({
        invalidResponse: true,
      } as unknown as { token: string; user: { username: string } });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('login in unsuccess')).toBeInTheDocument();
      });
    });

    test('handles null API response', async () => {
      const user = userEvent.setup();

      vi.mocked(mockDataFetch.mockFetchData).mockResolvedValue(null);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      );

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, '888888');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('login in unsuccess')).toBeInTheDocument();
      });
    });
  });
});
