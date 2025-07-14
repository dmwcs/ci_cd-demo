import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { defaultPumps } from '../../utils/mockData';
import type { Pump } from '../../types';
import { getPressureStats } from '../../utils/pressureStats';
import PumpsHeader from './components/PumpsHeader';
import PumpsTable from './components/PumpsTable';
import PumpsPagination from './components/PumpsPagination';

// 模拟API调用
const fetchPumps = async (): Promise<Pump[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return defaultPumps;
};

const PumpPage = () => {
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPumps = async () => {
      try {
        setLoading(true);
        const data = await fetchPumps();
        setPumps(data);
      } catch (err) {
        setError('Failed to load pumps data');
        console.error('Error fetching pumps:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPumps();
  }, []);

  // 排序和菜单事件处理
  const handleDropdownSelect = (eventKey: string | null) => {
    if (!eventKey) return;

    setPumps(prev => {
      const sorted = [...prev];

      switch (eventKey) {
        case 'name-asc':
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'pressure-asc':
          return sorted.sort((a, b) => {
            const aStats = getPressureStats(a.pressure);
            const bStats = getPressureStats(b.pressure);
            return (aStats?.current || 0) - (bStats?.current || 0);
          });
        case 'pressure-desc':
          return sorted.sort((a, b) => {
            const aStats = getPressureStats(a.pressure);
            const bStats = getPressureStats(b.pressure);
            return (bStats?.current || 0) - (aStats?.current || 0);
          });
        default:
          return sorted;
      }
    });
  };

  if (loading) {
    return (
      <Container
        className='d-flex flex-column justify-content-center align-items-center'
        style={{ minHeight: '80vh' }}
      >
        <div className='spinner-border mb-3' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='text-muted'>Loading pumps data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='py-4 text-center'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className='py-4'>
      <PumpsHeader onDropdownSelect={handleDropdownSelect} />
      <PumpsTable pumps={pumps} />
      <PumpsPagination></PumpsPagination>
    </Container>
  );
};

export default PumpPage;
