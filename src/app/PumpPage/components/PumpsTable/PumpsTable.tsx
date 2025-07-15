import React from 'react';
import { Table, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { TbEdit } from 'react-icons/tb';
import type { Pump } from '../../../../types';
import PumpsTableHeader from './components/PumpsTableHeader';
import PumpsTableRow from './components/PumpsTableRow';
import { usePump } from '../../../../hooks/usePump';
import { getPressureStats } from '../../../../utils/pressureStats';

interface PumpsTableProps {
  pumps?: Pump[];
}

const PumpCard: React.FC<{
  pump: Pump;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: (pumpId: string, isSelected: boolean) => void;
}> = ({ pump, isEditMode, isSelected, onSelect }) => {
  const stats = getPressureStats(pump.pressure);
  const current = stats?.current ?? '-';

  return (
    <Card className='mb-3 pump-card'>
      <Card.Body>
        <div className='d-flex justify-content-between align-items-start'>
          <div className='flex-grow-1'>
            <h6 className='mb-2 text-primary'>{pump.name}</h6>
            <Row className='g-2'>
              <Col xs={6}>
                <small className='text-muted'>Type:</small>
                <div>{pump.type}</div>
              </Col>
              <Col xs={6}>
                <small className='text-muted'>Area:</small>
                <div>{pump.area}</div>
              </Col>
              <Col xs={6}>
                <small className='text-muted'>Flow Rate:</small>
                <div>{pump.flowRate} GPM</div>
              </Col>
              <Col xs={6}>
                <small className='text-muted'>Current:</small>
                <div className='fw-semibold'>{current} psi</div>
              </Col>
            </Row>
          </div>
          {isEditMode && (
            <div className='d-flex flex-column gap-2 ms-3'>
              <Form.Check
                type='checkbox'
                checked={isSelected}
                onChange={e => onSelect(pump.id, e.target.checked)}
              />
              <Button
                variant='outline-primary'
                size='sm'
                onClick={() => console.log(`Edit pump ${pump.id}`)}
              >
                <TbEdit size={16} />
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const PumpsTable: React.FC<PumpsTableProps> = ({ pumps = [] }) => {
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
          />
        ))}
      </div>
    </>
  );
};

export default PumpsTable;
