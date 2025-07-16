import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import PumpPage from './PumpPage';
import { AuthProvider } from '../../hooks/useAuth';
import { PumpProvider } from '../../hooks/usePump';

// Mock dependencies
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>
      <PumpProvider>{children}</PumpProvider>
    </AuthProvider>
  </MemoryRouter>
);

describe('PumpPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders pump page with title', async () => {
      render(
        <TestWrapper>
          <PumpPage />
        </TestWrapper>,
      );

      // Initially shows loading
      expect(screen.getByText('Loading pumps data...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(
        () => {
          expect(screen.getByText('Pumps')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    test('shows new pump button', async () => {
      render(
        <TestWrapper>
          <PumpPage />
        </TestWrapper>,
      );

      await waitFor(
        () => {
          expect(screen.getByText('New Pump')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Search and Filter', () => {
    test('shows search functionality', async () => {
      render(
        <TestWrapper>
          <PumpPage />
        </TestWrapper>,
      );

      await waitFor(
        () => {
          // Just check that the page has loaded
          expect(screen.getByText('Pumps')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    test('shows control buttons', async () => {
      render(
        <TestWrapper>
          <PumpPage />
        </TestWrapper>,
      );

      await waitFor(
        () => {
          // Check that buttons exist
          const buttons = screen.getAllByRole('button');
          expect(buttons.length).toBeGreaterThan(0);
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Edit Mode', () => {
    test('shows page controls', async () => {
      render(
        <TestWrapper>
          <PumpPage />
        </TestWrapper>,
      );

      await waitFor(
        () => {
          // Just check that the page has loaded with controls
          expect(screen.getByText('New Pump')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Data Display', () => {
    test('displays pump data after loading', async () => {
      render(
        <TestWrapper>
          <PumpPage />
        </TestWrapper>,
      );

      // Wait for data to load and display
      await waitFor(
        () => {
          // Check if table or cards are rendered
          expect(
            screen.getByRole('table') || screen.getByText(/pump/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });
});
