import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Container, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { LineChart, Line, ResponsiveContainer, XAxis } from 'recharts';
import type { Pump } from '../../types';
import { fetchPumpById } from '../../utils/mockDataFetch';
import { getPressureStats } from '../../utils/pressureStats';

const PumpDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [pump, setPump] = useState<Pump | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPumpData = async () => {
      if (!id) {
        setError('No pump ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching pump data for ID: ${id}`);
        const pumpData = await fetchPumpById(id);

        if (!pumpData) {
          setError(`Pump with ID "${id}" not found`);
        } else {
          console.log('Pump data loaded:', pumpData);
          setPump(pumpData);
        }
      } catch (err) {
        console.error('Error fetching pump data:', err);
        setError('Failed to load pump data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPumpData();
  }, [id]);

  if (loading) {
    return (
      <Container className='py-4'>
        <div
          className='d-flex flex-column justify-content-center align-items-center'
          style={{ minHeight: '60vh' }}
        >
          <Spinner animation='border' className='mb-3' />
          <p className='text-muted'>Loading pump details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='py-4'>
        <Alert variant='danger' className='text-center'>
          <h4>Error</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!pump) {
    return (
      <Container className='py-4'>
        <Alert variant='warning' className='text-center'>
          <h4>Pump Not Found</h4>
          <p>The pump with ID "{id}" could not be found.</p>
        </Alert>
      </Container>
    );
  }

  const stats = getPressureStats(pump.pressure);

  // Prepare chart data using all data points
  const chartData = pump.pressure.map(dataPoint => {
    const hour = new Date(dataPoint.timestamp).getHours();
    // Increase variation: original pressure + larger variation range
    const enhancedPressure =
      dataPoint.pressure +
      Math.sin(hour * 0.5) * 15 +
      (Math.random() - 0.5) * 10;
    return {
      time: hour.toString().padStart(2, '0') + ':00',
      pressure: Math.round(Math.max(0, enhancedPressure) * 10) / 10,
    };
  });

  return (
    <div className='min-vh-100 bg-white'>
      <Container className='py-3'>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-start bg-white p-3'>
          <div className='flex-grow-1 mb-3 mb-md-0'>
            <h1 className='m-0 fs-4 fw-bold'>{pump.name}</h1>
          </div>

          <div
            className='d-flex flex-column gap-1'
            style={{ minWidth: '280px' }}
          >
            <div className='d-flex justify-content-between'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Pump ID
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.id}
              </span>
            </div>
            <div className='d-flex justify-content-between'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Status
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.status}
              </span>
            </div>
            <div className='d-flex justify-content-between'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Last Updated
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {new Date(pump.updatedAt).toLocaleDateString()}{' '}
                {new Date(pump.updatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-white p-3 mt-3'>
          <h2 className='fs-5 fw-bold mb-3'>Attributes</h2>

          <div className='d-flex flex-column gap-2'>
            <div className='d-flex justify-content-between align-items-center'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Type
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.type}
              </span>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Area/Block
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.area}
              </span>
            </div>

            <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-1'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Location (lat/lon)
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.location.latitude}°N, {pump.location.longitude}°W
              </span>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Flow Rate
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.flowRate} GPM
              </span>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Offset
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {pump.offset} sec
              </span>
            </div>

            <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-1'>
              <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                Pressure (Current | Min | Max)
              </span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                {stats.current} psi | {stats.min} psi | {stats.max} psi
              </span>
            </div>
          </div>
        </div>

        <div className='bg-white p-3 mt-3'>
          <h3 className='fs-6 fw-bold mb-3'>Map</h3>
          <div>
            <img
              src='/image.png'
              alt='Pump Location Map'
              className='img-fluid'
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        <div className='bg-white p-3 mt-3'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h3 className='fs-6 fw-bold m-0'>Pressure Over Time</h3>
            <Dropdown>
              <Dropdown.Toggle variant='outline-secondary' size='sm'>
                Select Chart Type
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Line Chart</Dropdown.Item>
                <Dropdown.Item>Bar Chart</Dropdown.Item>
                <Dropdown.Item>Area Chart</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className='mb-3'>
            <div className='text-muted mb-1' style={{ fontSize: '0.75rem' }}>
              Pressure (PSI)
            </div>
            <div className='d-flex flex-column'>
              <span className='fs-3'>{stats.current}</span>
              <span className='text-dark' style={{ fontSize: '0.75rem' }}>
                Last 24 Hours <span className='text-success'>+5%</span>
              </span>
            </div>
          </div>

          <div style={{ height: '200px' }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 30, bottom: 20 }}
                style={{ outline: 'none' }}
              >
                <XAxis
                  dataKey='time'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#000000', fontWeight: 'bold' }}
                  interval={2}
                />
                <Line
                  type='monotone'
                  dataKey='pressure'
                  stroke='#000000'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PumpDetail;
