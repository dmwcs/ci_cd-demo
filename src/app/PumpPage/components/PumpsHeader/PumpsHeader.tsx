import React from 'react';
import { Button, ButtonGroup, Container, Dropdown } from 'react-bootstrap';
import { TbSearch, TbFilter, TbEdit, TbTrash } from 'react-icons/tb';

interface PumpsHeaderProps {
  onDropdownSelect?: (eventKey: string | null) => void;
}

const PumpsHeader: React.FC<PumpsHeaderProps> = ({ onDropdownSelect }) => {
  return (
    <Container fluid className='px-0'>
      <div className='d-flex justify-content-between align-items-center'>
        <h2 className='fw-bold'>Pumps</h2>
        <Button variant='secondary' style={{ width: '120px' }}>
          New Pump
        </Button>
      </div>

      <div className='d-flex justify-content-between align-items-center py-3'>
        <ButtonGroup>
          <Button
            variant='outline-light'
            className='text-muted border-0'
            size='lg'
          >
            <TbSearch size={22} />
          </Button>
          <Dropdown as={ButtonGroup} onSelect={onDropdownSelect}>
            <Dropdown.Toggle
              variant='outline-light'
              className='no-caret  border-0'
            >
              <TbFilter color='black' size={22} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey='name-asc'>Pump Name A-Z</Dropdown.Item>
              <Dropdown.Item eventKey='name-desc'>Pump Name Z-A</Dropdown.Item>
              <Dropdown.Item eventKey='pressure-asc'>
                Current Pressure ↑
              </Dropdown.Item>
              <Dropdown.Item eventKey='pressure-desc'>
                Current Pressure ↓
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant='outline-light'
            className='text-muted  border-0'
            size='lg'
          >
            <TbEdit size={22} />
          </Button>
        </ButtonGroup>
        <Button
          variant='primary'
          className='d-flex align-items-center gap-2 px-4'
        >
          <TbTrash size={16} />
          Delete
        </Button>
      </div>
    </Container>
  );
};

export default PumpsHeader;
