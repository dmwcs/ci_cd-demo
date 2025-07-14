import React from 'react';

const PumpsTableHeader: React.FC = () => {
  const columns = [
    'Pump Name',
    'Type',
    'Area/Block',
    'Latitude',
    'Longitude',
    'Flow Rate',
    'Offset',
    'Current Pressure',
    'Min Pressure',
    'Max Pressure',
  ];

  return (
    <thead className='table-light'>
      <tr>
        {columns.map((column, index) => (
          <th key={index} scope='col' className='text-center'>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default PumpsTableHeader;
