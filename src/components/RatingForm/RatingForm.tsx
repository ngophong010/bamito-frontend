"use client";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import { Button, TextField, Box } from "@mui/material";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import "./RatingForm.scss";
// 1. Define the data shape for the form and the props
export interface RatingFormData {
  rating: number;
  description: string;
}
interface RatingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RatingFormData) => Promise<void>; // The parent provides the submission logic
  productName: string;
  initialData?: Partial<RatingFormData>; // For pre-filling in "edit" mode
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};
const RatingForm = ({ isOpen, onClose, onSubmit, productName, initialData }: RatingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, reset } = useForm<RatingFormData>({
    defaultValues: {
      rating: initialData?.rating || 0,
      description: initialData?.description || ''
    }
  });
  // Reset the form when the initial data changes (e.g., when a new product is selected)
  useEffect(() => {
    reset({
      rating: initialData?.rating || 0,
      description: initialData?.description || ''
    });
  }, [initialData, reset]);
  const handleFormSubmit: SubmitHandler<RatingFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // 2. Call the generic onSubmit function passed from the parent
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <h2 className="modal-title">Đánh giá sản phẩm: {productName}</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="rating-form">
          <Controller
            name="rating"
            control={control}
            rules={{ min: { value: 1, message: "Vui lòng chọn ít nhất 1 sao." } }}
            render={({ field, fieldState }) => (
              <div>
                <Rating {...field} precision={0.5} size="large" />
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
                label="Viết phản hồi của bạn..."
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
            )}
          />

          <div className="modal-actions">
            <Button onClick={onClose} disabled={isSubmitting}>Hủy</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
export default RatingForm;