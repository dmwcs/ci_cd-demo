import React from 'react';
import { Table } from 'react-bootstrap';
import type { Pump } from '../../../../types';
import PumpsTableHeader from './components/PumpsTableHeader';
import PumpsTableRow from './components/PumpsTableRow';

interface PumpsTableProps {
  pumps?: Pump[];
}

const PumpsTable: React.FC<PumpsTableProps> = ({ pumps = [] }) => {
  return (
    <Table
      hover
      responsive
      className='rounded overflow-hidden border'
      style={{
        borderRadius: '12px',
        borderCollapse: 'separate',
        borderSpacing: 0,
      }}
    >
      <PumpsTableHeader />
      <tbody>
        {pumps.map(pump => (
          <PumpsTableRow key={pump.id} pump={pump} />
        ))}
      </tbody>
    </Table>
  );
};

export default PumpsTable;
