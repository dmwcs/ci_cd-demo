import { Container } from 'react-bootstrap';
import PumpsHeader from './components/PumpsHeader';
import PumpsTable from './components/PumpsTable';

// 示例数据
const samplePumps = [
  {
    id: '1',
    name: 'Pump Alpha',
    status: 'active',
  },
  {
    id: '2',
    name: 'Pump Beta',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Pump Gamma',
    status: 'active',
  },
];

const PumpPage = () => {
  return (
    <Container className='py-4'>
      <PumpsHeader />
      <PumpsTable pumps={samplePumps} />
    </Container>
  );
};

export default PumpPage;
