import React from 'react';
import type { Pump } from '../../../../../../types';
import { getPressureStats } from '../../../../../../utils/pressureStats';

interface PumpsTableRowProps {
  pump: Pump;
}

const PumpsTableRow: React.FC<PumpsTableRowProps> = ({ pump }) => {
  const stats = getPressureStats(pump.pressure);
  const min = stats?.min ?? '-';
  const max = stats?.max ?? '-';
  const current = stats?.current ?? '-';

  const cellData = [
    pump.name,
    pump.type,
    pump.area,
    pump.location.latitude,
    pump.location.longitude,
    `${pump.flowRate} GPM`,
    `${pump.offset} sec`,
    `${current} psi`,
    `${min} psi`,
    `${max} psi`,
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
