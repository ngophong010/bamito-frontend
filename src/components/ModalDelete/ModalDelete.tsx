import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ModalDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa không?"
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Xóa
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalDelete;
