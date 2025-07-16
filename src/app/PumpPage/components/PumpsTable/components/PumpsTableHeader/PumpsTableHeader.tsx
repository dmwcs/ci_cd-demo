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
  // Check if current page is all selected
  const currentPagePumpIds = pumps.map(pump => pump.id);
  const selectedCurrentPagePumps = currentPagePumpIds.filter(id =>
    selectedPumps.has(id),
  );
  const isAllSelected =
    pumps.length > 0 && selectedCurrentPagePumps.length === pumps.length;
  const isIndeterminate =
    selectedCurrentPagePumps.length > 0 &&
    selectedCurrentPagePumps.length < pumps.length;

  const handleSelectAllChange = () => {
    // If currently all selected, clicking should deselect all
    // If currently not all selected, clicking should select all
    const shouldSelectAll = !isAllSelected;
    onSelectAll?.(shouldSelectAll);
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
