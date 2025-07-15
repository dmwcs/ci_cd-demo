import React from 'react';
import { Button } from 'react-bootstrap';
import { TbEdit, TbEditOff } from 'react-icons/tb';

interface EditButtonProps {
  onClick?: () => void;
  isEditMode?: boolean;
  className?: string;
  size?: 'sm' | 'lg' | undefined;
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  isEditMode = false,
  className,
  size = 'lg',
}) => {
  return (
    <Button
      variant={isEditMode ? 'primary' : 'outline-light'}
      className={`${isEditMode ? 'border-0' : 'text-muted border-0'} ${className || ''}`}
      size={size}
      onClick={onClick}
    >
      {isEditMode ? <TbEditOff size={18} /> : <TbEdit size={18} />}
    </Button>
  );
};

export default EditButton;
