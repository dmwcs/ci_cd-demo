import React from 'react';

interface Pump {
  id: string;
  name: string;
  status: string;
  // Add more pump properties as needed
}

interface PumpsTableRowProps {
  pump: Pump;
}

const PumpsTableRow: React.FC<PumpsTableRowProps> = ({ pump }) => {
  return (
    <tr>
      <td>{pump.id}</td>
      <td>{pump.name}</td>
      <td>
        <span
          className={`badge ${pump.status === 'active' ? 'bg-success' : 'bg-danger'}`}
        >
          {pump.status}
        </span>
      </td>
      <td>
        <button className='btn btn-sm btn-outline-primary me-2'>Edit</button>
        <button className='btn btn-sm btn-outline-danger'>Delete</button>
      </td>
    </tr>
  );
};

export default PumpsTableRow;
