import React from 'react';

const PumpsToolbar: React.FC = () => {
  return (
    <div className='pumps-toolbar'>
      {/* Add toolbar content here (buttons, filters, etc.) */}
      <div className='toolbar-actions'>
        <button className='btn btn-primary'>Add Pump</button>
        <button className='btn btn-secondary'>Export</button>
      </div>
    </div>
  );
};

export default PumpsToolbar;
