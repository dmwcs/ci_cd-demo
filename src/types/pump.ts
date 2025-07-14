export interface Pump {
  id: string;
  name: string;
  type: 'Centrifugal' | 'Submersible' | 'Diaphragm' | 'Rotary' | 'Peristaltic';
  area: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  flowRate: number; // GPM
  offset: number; // seconds
  pressure: {
    current: number; // psi
    min: number; // psi
    max: number; // psi
  };
  status: 'Operational' | 'Maintenance' | 'Offline' | 'Error';
  lastUpdated: Date;
}

export interface PumpFormData {
  name: string;
  type: Pump['type'];
  area: string;
  latitude: number;
  longitude: number;
  address?: string;
  flowRate: number;
  offset: number;
  minPressure: number;
  maxPressure: number;
  currentPressure: number;
  status: Pump['status'];
}

export interface PressureReading {
  id: string;
  pumpId: string;
  pressure: number; // psi
  timestamp: Date;
  status: 'Normal' | 'Warning' | 'Critical';
}
