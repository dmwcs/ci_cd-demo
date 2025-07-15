import React from 'react';
import { Button } from 'react-bootstrap';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import './EditButton.css';

interface EditButtonProps {
  onClick?: () => void;
  isEditMode?: boolean;
  size?: 'sm' | 'lg' | undefined;
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  isEditMode = false,
  size = 'lg',
}) => {
  return (
    <Button
      variant={isEditMode ? 'primary' : 'outline-light'}
      className='border'
      style={{ flex: '1 1 0' }}
      size={size}
      onClick={onClick}
    >
      {isEditMode ? (
        <TbEditOff size={18} color='black' />
      ) : (
        <TbEdit size={18} color='black' />
      )}
    </Button>
  );
};

export default EditButton;
