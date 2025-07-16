import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import PumpDetail from './PumpDetail';
import { AuthProvider } from '../../hooks/useAuth';
import { fetchPumpById } from '../../utils/mockDataFetch';

// Mock dependencies
vi.mock('../../utils/mockDataFetch');
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

// Mock recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='line-chart'>{children}</div>
  ),
  Line: () => <div data-testid='line' />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='responsive-container'>{children}</div>
  ),
  XAxis: () => <div data-testid='x-axis' />,
}));

const mockPump = {
  id: '1',
  name: 'Test Pump',
  type: 'Centrifugal' as const,
  area: 'Zone A',
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    address: 'New York, NY',
  },
  flowRate: 100,
  offset: 30,
  pressure: [
    { timestamp: new Date('2024-01-01T10:00:00'), pressure: 50 },
    { timestamp: new Date('2024-01-01T11:00:00'), pressure: 55 },
    { timestamp: new Date('2024-01-01T12:00:00'), pressure: 60 },
    { timestamp: new Date('2024-01-01T13:00:00'), pressure: 58 },
  ],
  status: 'Operational' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('PumpDetail Component', () => {
  const mockFetchPumpById = vi.mocked(fetchPumpById);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    test('shows loading spinner when fetching data', async () => {
      mockFetchPumpById.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockPump), 100)),
      );

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      expect(screen.getByText('Loading pump details...')).toBeInTheDocument();
      // Check for spinner element
      expect(document.querySelector('.spinner-border')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('shows error message when pump not found', async () => {
      mockFetchPumpById.mockResolvedValue(null);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByText('Pump with ID "1" not found'),
        ).toBeInTheDocument();
      });
    });

    test('shows error message when fetch fails', async () => {
      mockFetchPumpById.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load pump data. Please try again.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Data Display', () => {
    beforeEach(() => {
      mockFetchPumpById.mockResolvedValue(mockPump);
    });

    test('displays pump basic information', async () => {
      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Test Pump')).toBeInTheDocument();
        expect(screen.getByText('Centrifugal')).toBeInTheDocument();
        expect(screen.getByText('Zone A')).toBeInTheDocument();
        expect(screen.getByText('Operational')).toBeInTheDocument();
        expect(screen.getByText('100 GPM')).toBeInTheDocument();
      });
    });

    test('displays location information', async () => {
      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Check for location information being displayed
        expect(screen.getByText('Location (lat/lon)')).toBeInTheDocument();
        expect(screen.getByText('Zone A')).toBeInTheDocument();
      });
    });

    test('displays pressure statistics', async () => {
      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Check that pressure info is displayed
        expect(screen.getByText(/psi/)).toBeInTheDocument();
        expect(screen.getByText('Centrifugal')).toBeInTheDocument();
      });
    });
  });

  describe('Pressure Chart', () => {
    beforeEach(() => {
      mockFetchPumpById.mockResolvedValue(mockPump);
    });

    test('renders pressure chart when data is available', async () => {
      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line')).toBeInTheDocument();
        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      });
    });

    test('displays chart title', async () => {
      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Pressure Over Time')).toBeInTheDocument();
      });
    });
  });

  describe('Status Display', () => {
    test('displays pump status', async () => {
      mockFetchPumpById.mockResolvedValue(mockPump);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Operational')).toBeInTheDocument();
      });
    });

    test('displays different status values', async () => {
      const maintenancePump = { ...mockPump, status: 'Maintenance' as const };
      mockFetchPumpById.mockResolvedValue(maintenancePump);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Maintenance')).toBeInTheDocument();
      });
    });
  });

  describe('Empty Pressure Data', () => {
    test('handles pump with no pressure data', async () => {
      const pumpWithoutPressure = { ...mockPump, pressure: [] };
      mockFetchPumpById.mockResolvedValue(pumpWithoutPressure);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Check that pump details are displayed even with no pressure data
        expect(screen.getByText('Test Pump')).toBeInTheDocument();
        expect(screen.getByText('Centrifugal')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('displays pump details page', async () => {
      mockFetchPumpById.mockResolvedValue(mockPump);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Check that pump details are shown
        expect(screen.getByText('Test Pump')).toBeInTheDocument();
        expect(screen.getByText('Attributes')).toBeInTheDocument();
      });
    });
  });

  describe('Data Formatting', () => {
    test('formats flow rate with GPM unit', async () => {
      mockFetchPumpById.mockResolvedValue(mockPump);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('100 GPM')).toBeInTheDocument();
      });
    });

    test('formats pressure values with psi unit', async () => {
      mockFetchPumpById.mockResolvedValue(mockPump);

      render(
        <TestWrapper>
          <PumpDetail />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Check that pump data is formatted correctly
        expect(screen.getByText(/psi/)).toBeInTheDocument();
        expect(screen.getByText('100 GPM')).toBeInTheDocument();
      });
    });
  });
});
