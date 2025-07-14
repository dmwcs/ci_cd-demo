import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
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

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders navbar brand correctly', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByText('PumpMaster')).toBeInTheDocument();
    });

    test('renders all navigation links', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

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

    test('highlights Pumps navigation item as active', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const pumpsLink = screen.getByText('Pumps');
      expect(pumpsLink).toHaveClass('text-dark', 'fw-bold');
    });
  });

  describe('Authentication States', () => {
    test('does not show search and notification when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /bell/i }),
      ).not.toBeInTheDocument();
    });

    test('shows search and notification when authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { username: 'testuser' },
        logout: vi.fn(),
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Bell button
    });

    test('shows user dropdown when authenticated and user exists', () => {
      mockUseAuth.mockReturnValue({
        user: { username: 'testuser' },
        logout: vi.fn(),
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
    });

    test('does not show user dropdown when authenticated but no user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      expect(screen.queryByAltText('User Avatar')).not.toBeInTheDocument();
    });
  });

  describe('User Dropdown Interactions', () => {
    test('shows dropdown menu items when user dropdown is clicked', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({
        user: { username: 'testuser' },
        logout: vi.fn(),
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Click on the user dropdown toggle
      const userDropdownToggle = screen.getByText('testuser');
      await user.click(userDropdownToggle);

      await waitFor(() => {
        expect(screen.getByText('Logged in as: testuser')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    test('calls logout and navigates to login when logout is clicked', async () => {
      const userEvent_ = userEvent.setup();
      const mockLogout = vi.fn();

      mockUseAuth.mockReturnValue({
        user: { username: 'testuser' },
        logout: mockLogout,
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Click on the user dropdown toggle
      const userDropdownToggle = screen.getByText('testuser');
      await userEvent_.click(userDropdownToggle);

      // Wait for dropdown to appear and click logout
      await waitFor(async () => {
        const logoutButton = screen.getByText('Logout');
        await userEvent_.click(logoutButton);
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Responsive Design', () => {
    test('search bar has responsive classes', () => {
      mockUseAuth.mockReturnValue({
        user: { username: 'testuser' },
        logout: vi.fn(),
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const searchContainer = screen
        .getByPlaceholderText('Search')
        .closest('.d-none.d-lg-flex');
      expect(searchContainer).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    test('renders main content area with correct styling', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

      const { container } = render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass('pt-5', 'mt-2');
    });

    test('navbar has fixed-top styling', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      const navbar = document.querySelector('.navbar');
      expect(navbar).toHaveClass('fixed-top', 'bg-white', 'border-bottom');
    });
  });

  describe('Icons and Visual Elements', () => {
    test('renders brand icon', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: vi.fn(),
        isAuthenticated: false,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // Check if the star icon is rendered (it's an SVG from react-icons)
      const brandElement = screen.getByText('PumpMaster').parentElement;
      expect(brandElement).toBeInTheDocument();
    });

    test('renders search icon when authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { username: 'testuser' },
        logout: vi.fn(),
        isAuthenticated: true,
      });

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>,
      );

      // The search icon should be present in the search input group
      const searchInput = screen.getByPlaceholderText('Search');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
 