import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { TbFilter } from 'react-icons/tb';

interface FilterDropdownProps {
  onSelect?: (eventKey: string | null) => void;
  className?: string;
  size?: 'sm' | 'lg' | undefined;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onSelect,
  className,
  size,
}) => {
  return (
    <Dropdown
      as={ButtonGroup}
      onSelect={onSelect}
      className={`w-100 ${className || ''}`}
    >
      <Dropdown.Toggle variant='outline-light' className='no-caret' size={size}>
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
