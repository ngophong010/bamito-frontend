"use client";
import React from 'react';
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

// Define the props for the modal
interface CampaignComposerModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: { subject: string; content: string }) => Promise<void>; // Function to call on send
}

// A simple style object for the modal content
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const CampaignComposerModal = ({ open, onClose, onSend }: CampaignComposerModalProps) => {
    const [subject, setSubject] = React.useState('');
    const [content, setContent] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);

    const handleSend = async () => {
        if (!subject.trim() || !content.trim()) {
            // In a real app, you'd show a more specific error
            alert('Subject and Content cannot be empty.');
            return;
        }
        setIsSending(true);
        // The onSend prop is the actual service call, passed from the parent
        await onSend({ subject, content });
        setIsSending(false);
        onClose(); // Close the modal on success
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="campaign-composer-title"
        >
            <Box sx={style}>
                <Typography id="campaign-composer-title" variant="h6" component="h2">
                    Soạn Email Marketing
                </Typography>
                <TextField
                    fullWidth
                    label="Chủ đề Email"
                    variant="outlined"
                    margin="normal"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSending}
                />
                <TextField
                    fullWidth
                    label="Nội dung Email"
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSending}
                    // In a real system, you'd replace this with a Rich Text Editor like React-Quill
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose} disabled={isSending}>Hủy</Button>
                    <Button variant="contained" onClick={handleSend} disabled={isSending}>
                        {isSending ? <CircularProgress size={24} /> : 'Gửi Chiến Dịch'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
