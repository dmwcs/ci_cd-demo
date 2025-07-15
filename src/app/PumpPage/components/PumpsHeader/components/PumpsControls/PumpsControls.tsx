import React from 'react';
import {
  Button,
  ButtonGroup,
  InputGroup,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
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
      <div className='pumps-controls-desktop'>
        <div className='pumps-controls-left'>
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
          className='delete-button'
          disabled={selectedPumps.size === 0}
          onClick={handleDeleteClick}
        >
          <TbTrash size={16} />
          {selectedPumps.size > 0 ? `Delete (${selectedPumps.size})` : 'Delete'}
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className='pumps-controls-mobile'>
        {/* Search Bar */}
        <div className='mobile-search-bar'>
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
        <Row className='mobile-buttons-row gx-2'>
          <Col xs={4}>
            <FilterDropdown
              onSelect={handleDropdownSelect}
              className='mobile-filter-dropdown'
              size={undefined}
            />
          </Col>
          <Col xs={4}>
            <EditButton
              onClick={handleEditClick}
              isEditMode={isEditMode}
              className='mobile-action-btn'
              size={undefined}
            />
          </Col>
          <Col xs={4}>
            <Button
              variant={selectedPumps.size > 0 ? 'danger' : 'outline-secondary'}
              className='mobile-action-btn'
              disabled={selectedPumps.size === 0}
              onClick={handleDeleteClick}
            >
              <TbTrash size={18} />
              <span className='mobile-delete-count'>
                {selectedPumps.size > 0 ? `(${selectedPumps.size})` : ''}
              </span>
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PumpsControls;
