import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Container, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import type { Pump, PumpFormData } from '../../../../types';
import { defaultPumps } from '../../../../utils/mockData';

// Get unique values for dropdowns from mock data
const pumpTypes = [...new Set(defaultPumps.map((p: Pump) => p.type))];
const pumpAreas = [...new Set(defaultPumps.map((p: Pump) => p.area))];

const EditPumpForm: React.FC = () => {
  const { register, control, handleSubmit } = useForm<PumpFormData>();

  const onSubmit = (data: PumpFormData) => {
    // For now, just log the data as requested
    console.log(data);
  };

  return (
    <Container fluid='sm' className='py-4'>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header from the image */}
        <div className='text-center mb-4'>
          <h2 className='h2 fw-bold'>Pump 12345</h2>
          <p className='text-muted'>Pump ID: 12345</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Pump Name */}
          <Form.Group className='mb-3' controlId='pumpName'>
            <Form.Label>Pump Name</Form.Label>
            <Form.Control
              type='text'
              {...register('name')}
              defaultValue='Pump 12345' // From image
            />
          </Form.Group>

          {/* Pump Type */}
          <Form.Group className='mb-3' controlId='pumpType'>
            <Form.Label>Pump Type</Form.Label>
            <Controller
              name='type'
              control={control}
              defaultValue='Rotary' // From image
              render={({ field }) => (
                <Form.Select {...field}>
                  {pumpTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          {/* Area */}
          <Form.Group className='mb-3' controlId='pumpArea'>
            <Form.Label>Area</Form.Label>
            <Controller
              name='area'
              control={control}
              defaultValue='Area A' // From image
              render={({ field }) => (
                <Form.Select {...field}>
                  {pumpAreas.map(area => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          {/* Latitude / Longitude */}
          <Row className='mb-3'>
            <Form.Label>Latitude / Longitude</Form.Label>
            <Col>
              <Form.Control
                type='number'
                step='any'
                {...register('latitude')}
                defaultValue={34.0522} // From image
              />
            </Col>
            <Col>
              <Form.Control
                type='number'
                step='any'
                {...register('longitude')}
                defaultValue={-118.2437} // From image
              />
            </Col>
          </Row>

          {/* Offset */}
          <Form.Group className='mb-3' controlId='pumpOffset'>
            <Form.Label>Offset</Form.Label>
            <InputGroup>
              <Form.Control
                type='number'
                {...register('offset')}
                defaultValue={3} // From image
              />
              <InputGroup.Text>sec</InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Pressure Min / Max */}
          <Row className='mb-4'>
            <Form.Label>Pressure Min / Max</Form.Label>
            <Col>
              <InputGroup>
                <Form.Control
                  type='number'
                  {...register('minPressure')}
                  defaultValue={120} // From image
                />
                <InputGroup.Text>psi</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Form.Control
                  type='number'
                  {...register('maxPressure')}
                  defaultValue={180} // From image
                />
                <InputGroup.Text>psi</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          {/* Buttons */}
          <div className='d-flex justify-content-end gap-2'>
            <Button variant='light' type='button'>
              Cancel
            </Button>
            <Button variant='primary' type='submit'>
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EditPumpForm;
