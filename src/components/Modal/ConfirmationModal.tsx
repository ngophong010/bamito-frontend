"use client";
import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ConfirmationModal.scss';

// 1. Define the props. This makes the component highly configurable.
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string; // Optional message
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false
}: ConfirmationModalProps) => {

    const handleConfirmClick = () => {
        onConfirm();
        // The modal doesn't close itself. The parent's logic will close it
        // by setting 'isOpen' to false after the async action is complete.
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style} className="confirmation-modal">
                <FontAwesomeIcon icon={faTriangleExclamation} className="warning-icon" />

                <Typography variant="h5" component="h2" className="modal-title">
                    {title}
                </Typography>
                
                {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}

                <div className="modal-actions">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="contained"
                        color="error" // Use theme color for error actions
                        onClick={handleConfirmClick}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
