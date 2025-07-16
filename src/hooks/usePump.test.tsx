import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePump, PumpProvider } from './usePump';

// Create a wrapper component
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PumpProvider>{children}</PumpProvider>
);

describe('usePump', () => {
  it('should throw error when used outside PumpProvider', () => {
    // Test Hook without Provider
    expect(() => {
      renderHook(() => usePump());
    }).toThrow('usePump must be used within a PumpProvider');
  });

  it('should provide initial state values', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    expect(result.current.pumps).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.showSearch).toBe(false);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.isEditMode).toBe(false);
    expect(result.current.selectedPumps).toBeInstanceOf(Set);
    expect(result.current.selectedPumps.size).toBe(0);
    expect(result.current.showDeleteModal).toBe(false);
  });

  it('should toggle search visibility', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    expect(result.current.showSearch).toBe(false);

    act(() => {
      result.current.handleSearchClick();
    });

    expect(result.current.showSearch).toBe(true);

    act(() => {
      result.current.handleSearchClick();
    });

    expect(result.current.showSearch).toBe(false);
  });

  it('should toggle edit mode', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    expect(result.current.isEditMode).toBe(false);

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.isEditMode).toBe(true);

    act(() => {
      result.current.handleEditClick();
    });

    expect(result.current.isEditMode).toBe(false);
  });

  it('should manage pump selection', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    // Select a pump
    act(() => {
      result.current.handlePumpSelect('pump1', true);
    });

    expect(result.current.selectedPumps.has('pump1')).toBe(true);
    expect(result.current.selectedPumps.size).toBe(1);

    // Deselect
    act(() => {
      result.current.handlePumpSelect('pump1', false);
    });

    expect(result.current.selectedPumps.has('pump1')).toBe(false);
    expect(result.current.selectedPumps.size).toBe(0);
  });

  it('should manage delete modal visibility', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    expect(result.current.showDeleteModal).toBe(false);

    // First select a pump, then trigger delete
    act(() => {
      result.current.handlePumpSelect('pump1', true);
    });

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(result.current.showDeleteModal).toBe(true);

    // Cancel delete
    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.showDeleteModal).toBe(false);
  });

  it('should handle search functionality', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    // Test search
    act(() => {
      result.current.handleSearch('test search');
    });

    expect(result.current.searchTerm).toBe('test search');

    // Clear search
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.showSearch).toBe(false);
  });
});
