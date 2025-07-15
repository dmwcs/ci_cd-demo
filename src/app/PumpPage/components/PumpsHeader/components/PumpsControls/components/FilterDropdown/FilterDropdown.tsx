import React, { useState } from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { TbFilter } from 'react-icons/tb';
import './FilterDropdown.css';

interface FilterDropdownProps {
  onSelect?: (eventKey: string | null) => void;
  size?: 'sm' | 'lg' | undefined;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onSelect, size }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Dropdown
      as={ButtonGroup}
      onSelect={onSelect}
      onToggle={isOpen => setIsActive(isOpen)}
      className='filter-dropdown border'
      style={{ flex: '1 1 0' }}
    >
      <Dropdown.Toggle
        variant={isActive ? 'primary' : 'outline-light'}
        size={size}
      >
        <TbFilter color='black' size={18} />
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
  );
};

export default FilterDropdown;
