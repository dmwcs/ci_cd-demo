import { Container } from 'react-bootstrap';
import { defaultPumps } from '../../utils/mockData';
import PumpsHeader from './components/PumpsHeader';
import PumpsTable from './components/PumpsTable';

const PumpPage = () => {
  return (
    <Container className='py-4'>
      <PumpsHeader />
      <PumpsTable pumps={defaultPumps} />
    </Container>
  );
};

export default PumpPage;
