import React from 'react';
import { Button, ButtonGroup, InputGroup, Form } from 'react-bootstrap';
import { TbTrash, TbX } from 'react-icons/tb';
import SearchButton from './components/SearchButton';
import EditButton from './components/EditButton';
import FilterDropdown from './components/FilterDropdown';
import { usePump } from '../../../../../../hooks/usePump';
import './PumpsControls.css';

const PumpsControls: React.FC = () => {
  const {
    showSearch,
    searchTerm,
    isEditMode,
    selectedPumps,
    handleDropdownSelect,
    handleSearchClick,
    handleSearch,
    clearSearch,
    handleEditClick,
    handleDeleteClick,
  } = usePump();

  return (
    <>
      {/* Desktop Controls */}
      <div className='d-none d-md-flex justify-content-between align-items-center py-3 border'>
        <div className='pumps-controls-left d-flex align-items-center position-relative'>
          <SearchButton onClick={handleSearchClick} />

          <div
            className={`search-input-container ${showSearch ? 'show' : 'hide'}`}
          >
            <InputGroup size='sm'>
              <Form.Control
                type='text'
                placeholder='Search pumps...'
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                autoFocus={showSearch}
                className='search-input'
              />
              <Button
                variant='outline-secondary'
                size='sm'
                onClick={clearSearch}
              >
                <TbX size={14} />
              </Button>
            </InputGroup>
          </div>

          <div
            className={`button-group-container ${showSearch ? 'search-open' : 'search-closed'}`}
          >
            <ButtonGroup>
              <FilterDropdown onSelect={handleDropdownSelect} />
              <EditButton onClick={handleEditClick} isEditMode={isEditMode} />
            </ButtonGroup>
          </div>
        </div>
        <Button
          variant={selectedPumps.size > 0 ? 'primary' : 'secondary'}
          className='delete-button d-flex align-items-center gap-2 px-4'
          disabled={selectedPumps.size === 0}
          onClick={handleDeleteClick}
        >
          <TbTrash size={16} />
          {selectedPumps.size > 0 ? `Delete (${selectedPumps.size})` : 'Delete'}
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className='d-md-none d-block border'>
        {/* Search Bar */}
        <div>
          <InputGroup size='sm'>
            <Form.Control
              type='text'
              placeholder='Search pumps...'
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant='outline-secondary'
                size='sm'
                onClick={clearSearch}
              >
                <TbX size={14} />
              </Button>
            )}
          </InputGroup>
        </div>

        {/* Action Buttons */}
        <div className='d-flex justify-content-between gap-2'>
          <FilterDropdown onSelect={handleDropdownSelect} />
          <EditButton onClick={handleEditClick} isEditMode={isEditMode} />
          <Button
            variant={selectedPumps.size > 0 ? 'danger' : 'disable'}
            disabled={selectedPumps.size === 0}
            onClick={handleDeleteClick}
            className='flex-fill border-light'
          >
            <TbTrash size={18} color='black' />
            <span>
              {selectedPumps.size > 0 ? `(${selectedPumps.size})` : ''}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PumpsControls;
