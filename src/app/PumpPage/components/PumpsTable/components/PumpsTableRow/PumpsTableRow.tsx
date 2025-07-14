import React from 'react';
import type { Pump } from '../../../../../../types';

interface PumpsTableRowProps {
  pump: Pump;
}

const PumpsTableRow: React.FC<PumpsTableRowProps> = ({ pump }) => {
  const cellData = [
    pump.name,
    pump.type,
    pump.area,
    pump.location.latitude,
    pump.location.longitude,
    `${pump.flowRate} GPM`,
    pump.offset,
    `${pump.pressure.current} psi`,
    `${pump.pressure.min} psi`,
    `${pump.pressure.max} psi`,
  ];

  return (
    <tr>
      {cellData.map((data, index) => (
        <td key={index} className='text-center border-end-0 py-3 px-2'>
          {data}
        </td>
      ))}
    </tr>
  );
};

export default PumpsTableRow;
