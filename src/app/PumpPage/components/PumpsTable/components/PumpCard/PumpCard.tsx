import React from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { TbEdit } from 'react-icons/tb';
import type { Pump } from '../../../../../../types';
import { useNavigateToPump } from '../../../../../../hooks/useNavigation';
import { getPressureStats } from '../../../../../../utils/pressureStats';

interface PumpCardProps {
  pump: Pump;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: (pumpId: string, isSelected: boolean) => void;
  onEdit?: (pump: Pump) => void;
}

const PumpCard: React.FC<PumpCardProps> = ({
  pump,
  isEditMode,
  isSelected,
  onSelect,
  onEdit,
}) => {
  const { handlePumpClick } = useNavigateToPump();
  const stats = getPressureStats(pump.pressure);
  const current = stats?.current ?? '-';

  const handleCardClick = handlePumpClick(pump.id, isEditMode);

  return (
    <Card
      className='mb-3 pump-card'
      onClick={handleCardClick}
      style={{ cursor: isEditMode ? 'default' : 'pointer' }}
    >
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
                onClick={() => onEdit?.(pump)}
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

export default PumpCard;
