import React from 'react';
import { Button } from 'react-bootstrap';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import './EditButton.css';

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
      className={`edit-button ${isEditMode ? 'edit-mode' : 'normal-mode'} ${className || ''}`}
      size={size}
      onClick={onClick}
    >
      {isEditMode ? <TbEditOff size={18} /> : <TbEdit size={18} />}
    </Button>
  );
};

export default EditButton;
