import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  return (
    <>
      <style>
        {`
          .confirm-modal-backdrop {
            z-index: 99998 !important;
          }
          .modal {
            z-index: 99999 !important;
          }
        `}
      </style>
      <Modal
        show={show}
        onHide={onHide}
        centered
        style={{ zIndex: 99999 }} // 确保盖住 navbar (navbar 是 9999)
        backdrop='static'
        backdropClassName='confirm-modal-backdrop'
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal;
