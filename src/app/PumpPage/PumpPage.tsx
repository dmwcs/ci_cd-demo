import { useCallback, useState } from 'react';
import { Container } from 'react-bootstrap';
import PumpsHeader from './components/PumpsHeader';
import PumpsTable from './components/PumpsTable';
import PumpsPagination from './components/PumpsPagination';
import ConfirmModal from './components/ConfirmModal';
import EditPumpModal from './components/EditPumpForm';
import { PumpProvider, usePump } from '../../hooks/usePump';
import type { Pump } from '../../types';

const PumpPageContent = () => {
  const {
    paginatedPumps,
    loading,
    error,
    showDeleteModal,
    selectedPumps,
    currentPage,
    totalPages,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
  } = usePump();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPump, setEditingPump] = useState<Pump | null>(null);

  const handleOpenEditModal = useCallback((pump?: Pump) => {
    setEditingPump(pump ?? null);
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingPump(null);
  }, []);

  if (loading) {
    return (
      <Container
        className='d-flex flex-column justify-content-center align-items-center'
        style={{ minHeight: '80vh' }}
      >
        <div className='spinner-border mb-3' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='text-muted'>Loading pumps data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='py-4 text-center'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className='py-4'>
      <PumpsHeader onNewPump={() => handleOpenEditModal()} />
      <PumpsTable pumps={paginatedPumps} onEdit={handleOpenEditModal} />
      <PumpsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <EditPumpModal
        show={showEditModal}
        pump={editingPump}
        onClose={handleCloseEditModal}
      />

      <ConfirmModal
        show={showDeleteModal}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Confirm Delete'
        message={`Are you sure you want to delete ${selectedPumps.size} selected pump${selectedPumps.size > 1 ? 's' : ''}?<br />This action cannot be undone.`}
        confirmText='Confirm Delete'
        cancelText='Cancel'
        variant='danger'
      />
    </Container>
  );
};

const PumpPage = () => {
  return (
    <PumpProvider>
      <PumpPageContent />
    </PumpProvider>
  );
};

export default PumpPage;
