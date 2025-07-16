import React, { useState } from 'react';
import { Button, Container, Form, Dropdown } from 'react-bootstrap';
import { FiSearch, FiFilter, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { usePump } from '../../../../hooks/usePump';

interface PumpsHeaderProps {
  onNewPump?: () => void;
}

const PumpsHeader: React.FC<PumpsHeaderProps> = ({ onNewPump }) => {
  const {
    showSearch,
    isEditMode,
    selectedPumps,
    handleSearchClick,
    handleSearch,
    clearSearch,
    handleEditClick,
    handleDeleteClick,
    handleDropdownSelect,
  } = usePump();

  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearchToggle = () => {
    if (showSearch) {
      // If search box is showing, hide and clear
      setLocalSearchTerm('');
      clearSearch();
    } else {
      // Show search box
      handleSearchClick();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Real-time search
    handleSearch(value);
  };

  const iconButtonStyle = {
    border: 'none',
    background: 'transparent',
    padding: '2px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000000',
  };

  // Mobile button style
  const mobileButtonStyle = {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '12px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1',
    backgroundColor: 'transparent',
  };

  return (
    <Container fluid className='px-0'>
      {/* Header with title and new pump button */}
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2 className='fw-bold mb-0'>Pumps</h2>
        <div>
          <Button
            variant='light'
            className='d-none d-sm-block'
            style={{ width: '120px' }}
            onClick={onNewPump}
          >
            New Pump
          </Button>
          <Button
            variant='light'
            size='sm'
            className='d-block d-sm-none'
            onClick={onNewPump}
          >
            New
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='d-none d-sm-block'>
        <div
          className='d-flex justify-content-between align-items-center mb-2'
          style={{ minHeight: '48px' }}
        >
          {/* Left side - Search, Filter, Edit buttons */}
          <div className='d-flex align-items-center'>
            {/* Search Button - always visible */}
            <Button onClick={handleSearchToggle} style={iconButtonStyle}>
              <FiSearch size={20} />
            </Button>

            {/* Search Input - slides out from right of search button */}
            <div
              style={{
                width: showSearch ? '250px' : '0px',
                overflow: 'hidden',
                transition: 'width 0.3s ease-in-out',
                whiteSpace: 'nowrap',
                marginLeft: showSearch ? '8px' : '0px',
                marginRight: showSearch ? '8px' : '0px',
              }}
            >
              <Form.Control
                type='text'
                placeholder='Search pumps...'
                value={localSearchTerm}
                onChange={handleSearchChange}
                autoFocus={showSearch}
                style={{
                  width: '250px',
                  opacity: showSearch ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  height: '32px',
                  padding: '4px 12px',
                }}
              />
            </div>

            {/* Filter Dropdown */}
            <Dropdown style={{ marginLeft: '8px' }}>
              <Dropdown.Toggle className='no-caret' style={iconButtonStyle}>
                <FiFilter size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDropdownSelect('name-asc')}>
                  Name A-Z
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleDropdownSelect('name-desc')}
                >
                  Name Z-A
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleDropdownSelect('pressure-desc')}
                >
                  Pressure High-Low
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleDropdownSelect('pressure-asc')}
                >
                  Pressure Low-High
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Edit Button */}
            <Button
              onClick={handleEditClick}
              style={{
                ...iconButtonStyle,
                backgroundColor: isEditMode ? '#0d6efd' : 'transparent',
                color: isEditMode ? 'white' : 'inherit',
                marginLeft: '8px',
              }}
            >
              <FiEdit3 size={20} />
            </Button>
          </div>

          {/* Right side - Delete button - Desktop */}
          {isEditMode && (
            <Button
              variant='danger'
              size='sm'
              onClick={handleDeleteClick}
              disabled={selectedPumps.size === 0}
              className='d-flex align-items-center gap-2'
            >
              <FiTrash2 size={14} />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='d-block d-sm-none'>
        {/* Mobile Search Bar - always visible on top */}
        <div className='mb-3'>
          <Form.Control
            type='text'
            placeholder='Search pumps...'
            value={localSearchTerm}
            onChange={handleSearchChange}
            size='lg'
          />
        </div>

        {/* Mobile Action Buttons - bottom row */}
        <div className='d-flex gap-2 mb-3'>
          {/* Filter Button */}
          <Dropdown style={{ flex: '1' }}>
            <Dropdown.Toggle
              className='no-caret w-100'
              style={{
                ...mobileButtonStyle,
                color: '#000000',
              }}
            >
              <FiFilter size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDropdownSelect('name-asc')}>
                Name A-Z
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDropdownSelect('name-desc')}>
                Name Z-A
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleDropdownSelect('pressure-desc')}
              >
                Pressure High-Low
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleDropdownSelect('pressure-asc')}
              >
                Pressure Low-High
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Edit Button */}
          <Button
            onClick={handleEditClick}
            style={{
              ...mobileButtonStyle,
              backgroundColor: isEditMode ? '#0d6efd' : 'transparent',
              color: isEditMode ? 'white' : '#000000',
              borderColor: isEditMode ? '#0d6efd' : '#dee2e6',
            }}
          >
            <FiEdit3 size={20} />
          </Button>

          {/* Delete Button - Mobile - only show when in edit mode */}
          {isEditMode && (
            <Button
              onClick={handleDeleteClick}
              disabled={selectedPumps.size === 0}
              style={{
                ...mobileButtonStyle,
                backgroundColor:
                  selectedPumps.size > 0 ? '#dc3545' : 'transparent',
                color: selectedPumps.size > 0 ? 'white' : '#6c757d',
                borderColor: selectedPumps.size > 0 ? '#dc3545' : '#dee2e6',
              }}
            >
              <FiTrash2 size={20} />
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PumpsHeader;
