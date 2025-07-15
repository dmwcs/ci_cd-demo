import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from 'react';

import type { Pump } from '../types';
import { defaultPumps } from '../utils/mockData';
import { getPressureStats } from '../utils/pressureStats';

// Simulate API call to fetch pump data with a 1-second delay to mimic real network request
const fetchPumps = async (): Promise<Pump[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return defaultPumps;
};

interface PumpContextType {
  // Data state management for pumps list and loading status
  pumps: Pump[];
  originalPumps: Pump[];
  loading: boolean;
  error: string | null;

  // Search functionality state for filtering pumps by name, type, area, or location
  showSearch: boolean;
  searchTerm: string;

  // Edit mode state for bulk selection and editing operations
  isEditMode: boolean;
  selectedPumps: Set<string>;

  // Delete confirmation modal state for bulk deletion operations
  showDeleteModal: boolean;

  // Search methods for filtering and clearing pump data based on user input
  handleSearchClick: () => void;
  handleSearch: (term: string) => void;
  clearSearch: () => void;

  // Edit mode methods for bulk selection and managing edit state
  handleEditClick: () => void;
  handlePumpSelect: (pumpId: string, isSelected: boolean) => void;
  handleSelectAll: (isSelected: boolean) => void;

  // Delete methods for handling bulk deletion with confirmation modal
  handleDeleteClick: () => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;

  // Sorting methods for organizing pump data by name or pressure values
  handleDropdownSelect: (eventKey: string | null) => void;

  // 新建水泵
  createPump: (data: Omit<Pump, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // 编辑水泵
  updatePump: (id: string, data: Partial<Pump>) => void;
}

const PumpContext = createContext<PumpContextType | undefined>(undefined);

export const PumpProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // Data state management for storing pump data, loading status, and error handling
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [originalPumps, setOriginalPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state management for controlling search UI visibility and storing search terms
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit mode state management for bulk selection functionality and edit operations
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPumps, setSelectedPumps] = useState<Set<string>>(new Set());

  // Delete confirmation modal state for managing bulk deletion workflow
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initialize pump data on component mount by fetching from API and setting up initial state
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

  // Search method to filter pumps based on search term matching name, type, area, or location address
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

  // Clear search functionality by resetting search term, hiding search UI, and restoring original pump list
  const clearSearch = () => {
    setSearchTerm('');
    setShowSearch(false);
    setPumps(originalPumps);
  };

  // Toggle search UI visibility and clear search when hiding the search interface
  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      clearSearch();
    }
  };

  // Edit mode methods for managing bulk selection functionality and edit state transitions
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setSelectedPumps(new Set());
    }
  };

  // Handle individual pump selection by adding or removing pump ID from selected set
  const handlePumpSelect = (pumpId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedPumps);
    if (isSelected) {
      newSelected.add(pumpId);
    } else {
      newSelected.delete(pumpId);
    }
    setSelectedPumps(newSelected);
  };

  // Handle select all functionality by either selecting all visible pumps or clearing all selections
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPumps(new Set(pumps.map(pump => pump.id)));
    } else {
      setSelectedPumps(new Set());
    }
  };

  // Delete methods for handling bulk deletion workflow with confirmation modal
  const handleDeleteClick = () => {
    if (selectedPumps.size > 0) {
      setShowDeleteModal(true);
    }
  };

  // Confirm deletion by removing selected pumps from both current and original pump lists
  const handleConfirmDelete = () => {
    const updatedPumps = pumps.filter(pump => !selectedPumps.has(pump.id));
    setPumps(updatedPumps);
    setOriginalPumps(updatedPumps);
    setSelectedPumps(new Set());
    setShowDeleteModal(false);
  };

  // Cancel deletion by simply hiding the confirmation modal without any data changes
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Sorting method to organize pump data by name (alphabetical) or pressure values (numerical) in ascending or descending order
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

  const createPump = (data: Omit<Pump, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPump: Pump = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('Creating new pump:', newPump);
    setPumps(prev => {
      const updated = [newPump, ...prev];
      console.log('Updated pumps:', updated);
      return updated;
    });
    setOriginalPumps(prev => [newPump, ...prev]);
  };

  const updatePump = (id: string, data: Partial<Pump>) => {
    console.log('Updating pump:', id, data);
    setPumps(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...data, updatedAt: new Date() } : p,
      ),
    );
    setOriginalPumps(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...data, updatedAt: new Date() } : p,
      ),
    );
  };

  const value: PumpContextType = {
    // Data state management for pumps list and loading status
    pumps,
    originalPumps,
    loading,
    error,

    // Search functionality state for filtering pumps by name, type, area, or location
    showSearch,
    searchTerm,

    // Edit mode state for bulk selection and editing operations
    isEditMode,
    selectedPumps,

    // Delete confirmation modal state for bulk deletion operations
    showDeleteModal,

    // Methods for search, edit, delete, and sort operations
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
    createPump,
    updatePump,
  };

  return <PumpContext.Provider value={value}>{children}</PumpContext.Provider>;
};

export const usePump = () => {
  const context = useContext(PumpContext);
  if (context === undefined) {
    throw new Error('usePump must be used within a PumpProvider');
  }
  return context;
};

export default PumpContext;
