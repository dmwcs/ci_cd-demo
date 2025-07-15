import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { TbEdit } from 'react-icons/tb';
import type { Pump } from '../../../../../../types';
import { getPressureStats } from '../../../../../../utils/pressureStats';

interface PumpsTableRowProps {
  pump: Pump;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (pumpId: string, isSelected: boolean) => void;
}

const PumpsTableRow: React.FC<PumpsTableRowProps> = ({
  pump,
  isEditMode = false,
  isSelected = false,
  onSelect,
}) => {
  const stats = getPressureStats(pump.pressure);
  const min = stats?.min ?? '-';
  const max = stats?.max ?? '-';
  const current = stats?.current ?? '-';

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect?.(pump.id, e.target.checked);
  };

  return (
    <tr>
      {isEditMode && (
        <>
          <td className='text-center border-end-0 py-3 px-2'>
            <Form.Check
              type='checkbox'
              checked={isSelected}
              onChange={handleCheckboxChange}
            />
          </td>
          <td className='text-center border-end-0 py-3 px-2'>
            <Button
              variant='outline-primary'
              size='sm'
              onClick={() => console.log(`Edit pump ${pump.id}`)}
            >
              <TbEdit size={16} />
            </Button>
          </td>
        </>
      )}
      <td className='text-center border-end-0 py-3 px-2'>{pump.name}</td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
        {pump.type}
      </td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-lg-table-cell'>
        {pump.area}
      </td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-xl-table-cell'>
        {pump.location.latitude}
      </td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-xl-table-cell'>
        {pump.location.longitude}
      </td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
        {pump.flowRate} GPM
      </td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-lg-table-cell'>
        {pump.offset} sec
      </td>
      <td className='text-center border-end-0 py-3 px-2'>{current} psi</td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
        {min} psi
      </td>
      <td className='text-center border-end-0 py-3 px-2 d-none d-md-table-cell'>
        {max} psi
      </td>
    </tr>
  );
};

export default PumpsTableRow;
