import React from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  InputGroup,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { TbTrash, TbX } from 'react-icons/tb';
import SearchButton from './components/SearchButton';
import FilterDropdown from './components/FilterDropdown';
import EditButton from './components/EditButton';
import { usePump } from '../../../../hooks/usePump';

const PumpsHeader: React.FC = () => {
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
    <Container fluid className='px-0'>
      {/* Title and New Pump Button */}
      <Row className='align-items-center mb-3'>
        <Col>
          <h2 className='fw-bold mb-0'>Pumps</h2>
        </Col>
        <Col xs='auto'>
          <Button
            variant='secondary'
            className='d-none d-sm-block'
            style={{ width: '120px' }}
          >
            New Pump
          </Button>
          <Button variant='secondary' size='sm' className='d-block d-sm-none'>
            New
          </Button>
        </Col>
      </Row>

      {/* Desktop Controls */}
      <div className='d-none d-md-flex justify-content-between align-items-center py-3'>
        <div className='d-flex align-items-center position-relative'>
          <SearchButton onClick={handleSearchClick} />

          <div
            className='search-input-container'
            style={{
              position: 'absolute',
              left: '48px',
              top: '50%',
              transform: `translateY(-50%) scale(${showSearch ? '1' : '0'})`,
              transformOrigin: 'left center',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              opacity: showSearch ? 1 : 0,
              visibility: showSearch ? 'visible' : 'hidden',
              width: '250px',
              zIndex: 10,
            }}
          >
            <InputGroup size='sm'>
              <Form.Control
                type='text'
                placeholder='Search pumps...'
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                autoFocus={showSearch}
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #dee2e6',
                }}
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
            style={{
              marginLeft: showSearch ? '262px' : '0px',
              transition: 'margin-left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <ButtonGroup>
              <FilterDropdown onSelect={handleDropdownSelect} />
              <EditButton onClick={handleEditClick} isEditMode={isEditMode} />
            </ButtonGroup>
          </div>
        </div>
        <Button
          variant={selectedPumps.size > 0 ? 'primary' : 'secondary'}
          className='d-flex align-items-center gap-2 px-4'
          disabled={selectedPumps.size === 0}
          onClick={handleDeleteClick}
        >
          <TbTrash size={16} />
          {selectedPumps.size > 0 ? `Delete (${selectedPumps.size})` : 'Delete'}
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className='d-block d-md-none'>
        {/* Search Bar */}
        <div className='mb-3'>
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
        <Row className='mobile-buttons-row gx-2 mb-3'>
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
              <span className='d-none d-sm-inline'>
                {selectedPumps.size > 0 ? `(${selectedPumps.size})` : ''}
              </span>
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default PumpsHeader;
