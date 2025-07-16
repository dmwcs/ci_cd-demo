import type { Pump } from '../types';
import { defaultPumps } from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock login API call
export const mockFetchData = async (
  endpoint: string,
  credentials: { username: string; password: string },
) => {
  await delay(1000);

  if (endpoint === '/login') {
    const { username, password } = credentials;

    // Simple user validation logic
    if (username === 'admin' && password === '888888') {
      return {
        token: 'mock-jwt-token-12345',
        user: username,
      };
    }

    throw new Error('Invalid credentials');
  }

  throw new Error('Endpoint not found');
};

// Mock API call to fetch single pump data
export const fetchPumpById = async (id: string): Promise<Pump | null> => {
  // Simulate network delay
  await delay(500);

  // Find pump by ID from mockData
  const pump = defaultPumps.find(p => p.id === id);

  if (!pump) {
    return null;
  }

  // Mock return data, can add more data processing logic here
  return pump;
};

// Mock API call to fetch all pump data (for consistency)
export const fetchAllPumps = async (): Promise<Pump[]> => {
  await delay(1000);
  return defaultPumps;
};
