import React from 'react';
import { Button, Container } from 'react-bootstrap';
import PumpsControls from './components/PumpsControls';

const PumpsHeader: React.FC = () => {
  return (
    <Container fluid className='px-0'>
      {/* Title and New Pump Button */}
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h2 className='fw-bold mb-0'>Pumps</h2>
        <div>
          <Button
            variant='secondary'
            className='d-none d-sm-block'
            style={{ width: '120px' }}
          >
            New Pump
          </Button>
          <Button variant='secondary' size='sm' className='d-block d-sm-none'>
            New
          </Button>
        </div>
      </div>

      <PumpsControls />
    </Container>
  );
};

export default PumpsHeader;
