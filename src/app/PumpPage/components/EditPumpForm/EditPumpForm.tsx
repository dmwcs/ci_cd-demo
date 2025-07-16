import React, { useEffect } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import type { Pump, PumpFormData } from '../../../../types';
import { defaultPumps } from '../../../../utils/mockData';
import { getPressureStats } from '../../../../utils/pressureStats';
import { usePump } from '../../../../hooks/usePump';
import './EditPumpForm.css';

const pumpTypes = [...new Set(defaultPumps.map((p: Pump) => p.type))];
const pumpAreas = [...new Set(defaultPumps.map((p: Pump) => p.area))];

interface EditPumpModalProps {
  show: boolean;
  pump: Pump | null;
  onClose: () => void;
}

const EditPumpModal: React.FC<EditPumpModalProps> = ({
  show,
  pump,
  onClose,
}) => {
  const { register, handleSubmit, reset } = useForm<PumpFormData>();
  const { createPump, updatePump } = usePump();

  useEffect(() => {
    if (pump) {
      const stats = getPressureStats(pump.pressure);
      reset({
        name: pump.name,
        type: pump.type,
        area: pump.area,
        latitude: pump.location.latitude,
        longitude: pump.location.longitude,
        offset: pump.offset,
        minPressure: stats.min,
        maxPressure: stats.max,
      });
    } else {
      reset({
        name: '',
        type: pumpTypes[0],
        area: pumpAreas[0],
        latitude: 0,
        longitude: 0,
        offset: 0,
        minPressure: 0,
        maxPressure: 0,
      });
    }
  }, [pump, reset]);

  const onSubmit = (data: PumpFormData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    console.log('Form data:', data);

    if (!pump) {
      const newPumpData = {
        name: data.name,
        type: data.type,
        area: data.area,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        flowRate: 0,
        offset: data.offset,
        pressure: [],
        status: 'Operational' as const,
      };
      console.log('Creating pump with data:', newPumpData);
      createPump(newPumpData);
    } else {
      const updateData = {
        name: data.name,
        type: data.type,
        area: data.area,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        offset: data.offset,
      };
      console.log('Updating pump with data:', updateData);
      updatePump(pump.id, updateData);
    }
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size='lg'
      backdrop='static'
      backdropClassName='edit-modal-backdrop'
    >
      <Modal.Header closeButton>
        <Modal.Title>{pump ? 'Edit Pump' : 'New Pump'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex flex-column align-items-center py-4'>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <div className='d-flex flex-column align-items-center mb-4'>
              <h2 className='h2 fw-bold'>{pump?.name || 'New Pump'}</h2>
              {pump && <p className='text-muted'>Pump ID: {pump?.id || '-'}</p>}
            </div>
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='d-flex flex-column mb-3 w-100'>
                <Form.Label htmlFor='pumpName'>Pump Name</Form.Label>
                <Form.Control
                  id='pumpName'
                  type='text'
                  className='bg-light'
                  {...register('name')}
                />
              </div>

              <div className='d-flex flex-column mb-3 w-100'>
                <Form.Label htmlFor='pumpType'>Pump Type</Form.Label>
                <Form.Select
                  id='pumpType'
                  className='bg-light'
                  {...register('type')}
                >
                  {pumpTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className='d-flex flex-column mb-3 w-100'>
                <Form.Label htmlFor='pumpArea'>Area</Form.Label>
                <Form.Select
                  id='pumpArea'
                  className='bg-light'
                  {...register('area')}
                >
                  {pumpAreas.map(area => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className='d-flex flex-column mb-3 w-100'>
                <Form.Label>Latitude / Longitude</Form.Label>
                <div className='d-flex gap-2'>
                  <Form.Control
                    type='text'
                    placeholder='Latitude'
                    className='bg-light'
                    {...register('latitude', { valueAsNumber: true })}
                  />
                  <Form.Control
                    type='text'
                    placeholder='Longitude'
                    className='bg-light'
                    {...register('longitude', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className='d-flex flex-column mb-3 w-100'>
                <Form.Label htmlFor='pumpOffset'>Offset</Form.Label>
                <InputGroup>
                  <Form.Control
                    id='pumpOffset'
                    type='text'
                    className='bg-light'
                    {...register('offset', { valueAsNumber: true })}
                  />
                  <InputGroup.Text className='bg-light'>sec</InputGroup.Text>
                </InputGroup>
              </div>

              <div className='d-flex flex-column mb-4 w-100'>
                <Form.Label>Pressure Min / Max</Form.Label>
                <div className='d-flex gap-2'>
                  <InputGroup className='flex-grow-1'>
                    <Form.Control
                      type='text'
                      placeholder='Min Pressure'
                      className='bg-light'
                      {...register('minPressure', { valueAsNumber: true })}
                    />
                    <InputGroup.Text className='bg-light'>psi</InputGroup.Text>
                  </InputGroup>
                  <InputGroup className='flex-grow-1'>
                    <Form.Control
                      type='text'
                      placeholder='Max Pressure'
                      className='bg-light'
                      {...register('maxPressure', { valueAsNumber: true })}
                    />
                    <InputGroup.Text className='bg-light'>psi</InputGroup.Text>
                  </InputGroup>
                </div>
              </div>

              <div className='d-flex justify-content-end gap-2 w-100'>
                <Button variant='light' type='button' onClick={onClose}>
                  Cancel
                </Button>
                <Button variant='primary' type='submit'>
                  Save
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditPumpModal;
