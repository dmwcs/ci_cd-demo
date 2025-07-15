import React from 'react';
import { Form } from 'react-bootstrap';
import type { Pump } from '../../../../../../types';

interface PumpsTableHeaderProps {
  isEditMode?: boolean;
  selectedPumps?: Set<string>;
  pumps?: Pump[];
  onSelectAll?: (isSelectAll: boolean) => void;
}

const PumpsTableHeader: React.FC<PumpsTableHeaderProps> = ({
  isEditMode = false,
  selectedPumps = new Set(),
  pumps = [],
  onSelectAll,
}) => {
  const isAllSelected = pumps.length > 0 && selectedPumps.size === pumps.length;
  const isIndeterminate =
    selectedPumps.size > 0 && selectedPumps.size < pumps.length;

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll?.(e.target.checked);
  };

  return (
    <thead>
      <tr>
        {isEditMode && (
          <>
            <th className='text-center border-end-0 py-3 px-2'>
              <Form.Check
                type='checkbox'
                checked={isAllSelected}
                ref={(input: HTMLInputElement | null) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAllChange}
              />
            </th>
            <th className='text-center border-end-0 py-3 px-2'>Edit</th>
          </>
        )}
        <th className='text-center border-end-0 py-3 px-2'>Name</th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
          Type
        </th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-lg-table-cell'>
          Area
        </th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-xl-table-cell'>
          Latitude
        </th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-xl-table-cell'>
          Longitude
        </th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
          Flow Rate
        </th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-lg-table-cell'>
          Offset
        </th>
        <th className='text-center border-end-0 py-3 px-2'>Current</th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
          Min
        </th>
        <th className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
          Max
        </th>
      </tr>
    </thead>
  );
};

export default PumpsTableHeader;
