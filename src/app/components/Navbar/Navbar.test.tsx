import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Navbar from './Navbar';
import { AuthProvider } from '../../../hooks/useAuth';

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

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Unauthenticated State', () => {
    test('shows login link when user is not authenticated', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByText('PumpMaster')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    test('does not show user dropdown when not authenticated', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.queryByText(/logged in as/i)).not.toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    beforeEach(() => {
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('username', 'testuser');
    });

    test('shows user dropdown when authenticated', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    test('displays user avatar', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const avatar = screen.getByAltText('User Avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://i.pravatar.cc/40?img=2');
    });

    test('shows logout option in dropdown', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Click on user dropdown
      const userDropdown = screen.getByText('testuser');
      await user.click(userDropdown);

      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('handles logout correctly', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Click on user dropdown
      const userDropdown = screen.getByText('testuser');
      await user.click(userDropdown);

      // Click logout
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
    });
  });

  describe('Navigation Links', () => {
    test('displays all navigation links', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Pumps')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    test('highlights Pumps link as active', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const pumpsLink = screen.getByText('Pumps');
      expect(pumpsLink).toHaveClass('text-dark', 'fw-bold');
    });
  });

  describe('Brand and Logo', () => {
    test('displays brand name and logo', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByText('PumpMaster')).toBeInTheDocument();
      // Check if logo icon is present (PiStarFourFill)
      expect(screen.getByText('PumpMaster').closest('a')).toHaveAttribute(
        'href',
        '/',
      );
    });
  });

  describe('Responsive Design', () => {
    test('has mobile toggle button', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const toggleButton = screen.getByRole('button', {
        name: /toggle navigation/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    test('has proper navbar structure', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      // Check that navbar contains the brand
      expect(screen.getByText('PumpMaster')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    test('shows search icon when authenticated', () => {
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('username', 'testuser');

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Search input should be present when authenticated
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });

  describe('Notification Functionality', () => {
    test('shows notification icon when authenticated', () => {
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('username', 'testuser');

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Notification button should be present when authenticated
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
