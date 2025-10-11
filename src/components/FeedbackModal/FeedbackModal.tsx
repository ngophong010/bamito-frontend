"use client";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import { Button, TextField, Box } from "@mui/material";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import "./FeedbackModal.scss";

// 1. Define the props. The component is highly configurable.
export interface FeedbackFormData {
    rating: number;
    description: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => Promise<void>;
  productName: string;
  initialData?: Partial<FeedbackFormData>; // Optional data for pre-filling in "edit" mode
}

const style = { /* ... your MUI style object ... */ };

const FeedbackModal = ({ isOpen, onClose, onSubmit, productName, initialData }: FeedbackModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 2. Determine the mode based on the presence of initialData
  const isEditMode = !!initialData;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FeedbackFormData>({
      defaultValues: {
          rating: 0,
          description: ''
      }
  });

  // 3. Use an effect to reset the form whenever the modal opens or the initial data changes.
  useEffect(() => {
    if (isOpen) {
        reset({
            rating: initialData?.rating || 0,
            description: initialData?.description || ''
        });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // The parent is now responsible for closing the modal on success
    } catch (error) {
      // The parent is responsible for showing error toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
      reset(); // Also reset form on manual close
      onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style} className="feedback-modal">
        <FontAwesomeIcon icon={faCircleXmark} className="modal-close-icon" onClick={handleClose} />

        <h2 className="modal-title">
            {isEditMode ? 'Chỉnh sửa Đánh giá' : 'Viết Đánh giá'} cho: {productName}
        </h2>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="feedback-form">
          <Controller
            name="rating"
            control={control}
            rules={{ min: { value: 1, message: "Vui lòng chọn ít nhất 1 sao." } }}
            render={({ field, fieldState }) => (
                <div className="rating-input">
                    <Rating {...field} value={Number(field.value)} precision={0.5} size="large" />
                    {fieldState.error && <p className="error-message">{fieldState.error.message}</p>}
                </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Viết phản hồi của bạn (không bắt buộc)..."
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                />
            )}
          />

          <div className="modal-actions">
            <Button onClick={handleClose} disabled={isSubmitting}>Hủy</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : (isEditMode ? 'Cập nhật' : 'Gửi đánh giá')}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
