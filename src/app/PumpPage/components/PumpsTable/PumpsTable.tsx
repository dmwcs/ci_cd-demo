import React from 'react';
import { Table } from 'react-bootstrap';
import type { Pump } from '../../../../types';
import PumpsTableHeader from './components/PumpsTableHeader';
import PumpsTableRow from './components/PumpsTableRow';
import PumpCard from './components/PumpCard';
import { usePump } from '../../../../hooks/usePump';

interface PumpsTableProps {
  pumps?: Pump[];
  onEdit?: (pump: Pump) => void;
}

const PumpsTable: React.FC<PumpsTableProps> = ({ pumps = [], onEdit }) => {
  const { isEditMode, selectedPumps, handlePumpSelect, handleSelectAll } =
    usePump();

  return (
    <>
      {/* Desktop Table View */}
      <div className='d-none d-sm-block'>
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
          <PumpsTableHeader
            isEditMode={isEditMode}
            selectedPumps={selectedPumps}
            pumps={pumps}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {pumps.map(pump => (
              <PumpsTableRow
                key={pump.id}
                pump={pump}
                isEditMode={isEditMode}
                isSelected={selectedPumps.has(pump.id)}
                onSelect={handlePumpSelect}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className='d-block d-sm-none'>
        {pumps.map(pump => (
          <PumpCard
            key={pump.id}
            pump={pump}
            isEditMode={isEditMode}
            isSelected={selectedPumps.has(pump.id)}
            onSelect={handlePumpSelect}
            onEdit={onEdit}
          />
        ))}
      </div>
    </>
  );
};

export default PumpsTable;
