import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePump, PumpProvider } from './usePump';

// 创建一个包装器组件
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PumpProvider>{children}</PumpProvider>
);

describe('usePump', () => {
  it('should throw error when used outside PumpProvider', () => {
    // 在没有 Provider 的情况下测试 Hook
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

    // 选择一个泵
    act(() => {
      result.current.handlePumpSelect('pump1', true);
    });

    expect(result.current.selectedPumps.has('pump1')).toBe(true);
    expect(result.current.selectedPumps.size).toBe(1);

    // 取消选择
    act(() => {
      result.current.handlePumpSelect('pump1', false);
    });

    expect(result.current.selectedPumps.has('pump1')).toBe(false);
    expect(result.current.selectedPumps.size).toBe(0);
  });

  it('should manage delete modal visibility', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    expect(result.current.showDeleteModal).toBe(false);

    // 先选择一个泵，然后触发删除
    act(() => {
      result.current.handlePumpSelect('pump1', true);
    });

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(result.current.showDeleteModal).toBe(true);

    // 取消删除
    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.showDeleteModal).toBe(false);
  });

  it('should handle search functionality', () => {
    const { result } = renderHook(() => usePump(), { wrapper });

    // 测试搜索
    act(() => {
      result.current.handleSearch('test search');
    });

    expect(result.current.searchTerm).toBe('test search');

    // 清除搜索
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.showSearch).toBe(false);
  });
});
