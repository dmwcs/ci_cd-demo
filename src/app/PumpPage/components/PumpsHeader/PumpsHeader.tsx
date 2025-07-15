import React from 'react';
import { Button, Container } from 'react-bootstrap';
import PumpsControls from './components/PumpsControls';

interface PumpsHeaderProps {
  onNewPump?: () => void;
}

const PumpsHeader: React.FC<PumpsHeaderProps> = ({ onNewPump }) => {
  return (
    <Container fluid className='px-0'>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2 className='fw-bold mb-0'>Pumps</h2>
        <div>
          <Button
            variant='light'
            className='d-none d-sm-block'
            style={{ width: '120px' }}
            onClick={onNewPump}
          >
            New Pump
          </Button>
          <Button
            variant='light'
            size='sm'
            className='d-block d-sm-none'
            onClick={onNewPump}
          >
            New
          </Button>
        </div>
      </div>
      <PumpsControls />
    </Container>
  );
};

export default PumpsHeader;
