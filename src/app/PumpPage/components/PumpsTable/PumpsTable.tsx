import React from 'react';
import PumpsTableHeader from './components/PumpsTableHeader';
import PumpsTableRow from './components/PumpsTableRow';

interface Pump {
  id: string;
  name: string;
  status: string;
  // Add more pump properties as needed
}

interface PumpsTableProps {
  pumps?: Pump[];
}

const PumpsTable: React.FC<PumpsTableProps> = ({ pumps = [] }) => {
  return (
    <div className='pumps-table'>
      <table className='table table-striped'>
        <PumpsTableHeader />
        <tbody>
          {pumps.map(pump => (
            <PumpsTableRow key={pump.id} pump={pump} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PumpsTable;
