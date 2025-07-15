import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Pump } from '../types';
import { defaultPumps } from '../utils/mockData';
import { getPressureStats } from '../utils/pressureStats';

// 模拟API调用
const fetchPumps = async (): Promise<Pump[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return defaultPumps;
};

interface PumpContextType {
  // 数据状态
  pumps: Pump[];
  originalPumps: Pump[];
  loading: boolean;
  error: string | null;

  // 搜索相关
  showSearch: boolean;
  searchTerm: string;

  // 编辑相关
  isEditMode: boolean;
  selectedPumps: Set<string>;

  // 删除相关
  showDeleteModal: boolean;

  // 搜索方法
  handleSearchClick: () => void;
  handleSearch: (term: string) => void;
  clearSearch: () => void;

  // 编辑方法
  handleEditClick: () => void;
  handlePumpSelect: (pumpId: string, isSelected: boolean) => void;
  handleSelectAll: (isSelected: boolean) => void;

  // 删除方法
  handleDeleteClick: () => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;

  // 排序方法
  handleDropdownSelect: (eventKey: string | null) => void;
}

const PumpContext = createContext<PumpContextType | undefined>(undefined);

interface PumpProviderProps {
  children: ReactNode;
}

export const PumpProvider: React.FC<PumpProviderProps> = ({ children }) => {
  // 数据状态
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [originalPumps, setOriginalPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 搜索状态
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 编辑状态
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPumps, setSelectedPumps] = useState<Set<string>>(new Set());

  // 删除状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 初始化数据
  useEffect(() => {
    const loadPumps = async () => {
      try {
        setLoading(true);
        const data = await fetchPumps();
        setPumps(data);
        setOriginalPumps(data);
      } catch (err) {
        setError('Failed to load pumps data');
        console.error('Error fetching pumps:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPumps();
  }, []);

  // 搜索方法
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setPumps(originalPumps);
      return;
    }

    const filteredPumps = originalPumps.filter(
      pump =>
        pump.name.toLowerCase().includes(term.toLowerCase()) ||
        pump.type.toLowerCase().includes(term.toLowerCase()) ||
        pump.area.toLowerCase().includes(term.toLowerCase()) ||
        pump.location.address?.toLowerCase().includes(term.toLowerCase()),
    );
    setPumps(filteredPumps);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearch(false);
    setPumps(originalPumps);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      clearSearch();
    }
  };

  // 编辑方法
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setSelectedPumps(new Set());
    }
  };

  const handlePumpSelect = (pumpId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedPumps);
    if (isSelected) {
      newSelected.add(pumpId);
    } else {
      newSelected.delete(pumpId);
    }
    setSelectedPumps(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPumps(new Set(pumps.map(pump => pump.id)));
    } else {
      setSelectedPumps(new Set());
    }
  };

  // 删除方法
  const handleDeleteClick = () => {
    if (selectedPumps.size > 0) {
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    const updatedPumps = pumps.filter(pump => !selectedPumps.has(pump.id));
    setPumps(updatedPumps);
    setOriginalPumps(updatedPumps);
    setSelectedPumps(new Set());
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // 排序方法
  const handleDropdownSelect = (eventKey: string | null) => {
    if (!eventKey) return;

    setPumps(prev => {
      const sorted = [...prev];

      switch (eventKey) {
        case 'name-asc':
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'pressure-asc':
          return sorted.sort((a, b) => {
            const aStats = getPressureStats(a.pressure);
            const bStats = getPressureStats(b.pressure);
            return (aStats?.current || 0) - (bStats?.current || 0);
          });
        case 'pressure-desc':
          return sorted.sort((a, b) => {
            const aStats = getPressureStats(a.pressure);
            const bStats = getPressureStats(b.pressure);
            return (bStats?.current || 0) - (aStats?.current || 0);
          });
        default:
          return sorted;
      }
    });
  };

  const value: PumpContextType = {
    // 数据状态
    pumps,
    originalPumps,
    loading,
    error,

    // 搜索相关
    showSearch,
    searchTerm,

    // 编辑相关
    isEditMode,
    selectedPumps,

    // 删除相关
    showDeleteModal,

    // 方法
    handleSearchClick,
    handleSearch,
    clearSearch,
    handleEditClick,
    handlePumpSelect,
    handleSelectAll,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleDropdownSelect,
  };

  return <PumpContext.Provider value={value}>{children}</PumpContext.Provider>;
};

// 自定义 Hook
export const usePump = () => {
  const context = useContext(PumpContext);
  if (context === undefined) {
    throw new Error('usePump must be used within a PumpProvider');
  }
  return context;
};

export default PumpContext;
