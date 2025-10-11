"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, TextField, Button } from "@mui/material";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { ChangePasswordData } from "@/types"; // You'll create this type
import "./ModalChangePassword.scss";

// Define the shape of the form data, including the confirm password field
type FormInputs = ChangePasswordData & {
    confirmPassword?: string;
};

// 1. Define the props this component needs. It's now very clean.
interface ModalChangePasswordProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordData) => Promise<void>; // The parent provides the submission logic
}

const style = { /* ... your MUI style object ... */ };

const ModalChangePassword = ({ open, onClose, onSubmit }: ModalChangePasswordProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm<FormInputs>();

  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      // 2. Call the generic onSubmit function passed from the parent
      await onSubmit(data);
      reset(); // Reset the form fields on success
      onClose(); // The parent will handle closing the modal, but we can also call it here.
    } catch (error) {
        // The parent will handle showing the toast, so this component does nothing on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
      reset(); // Reset form fields when closing
      onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="modal-content">
        <FontAwesomeIcon icon={faCircleXmark} className="modal-close-icon" onClick={handleClose} />

        <h3 className="modal-title">Thay đổi mật khẩu</h3>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Controller
                name="currentPassword"
                control={control}
                rules={{ required: "Vui lòng nhập mật khẩu hiện tại" }}
                render={({ field }) => (
                    <TextField {...field} type="password" label="Mật khẩu hiện tại" fullWidth margin="normal" error={!!errors.currentPassword} helperText={errors.currentPassword?.message} />
                )}
            />
            <Controller
                name="newPassword"
                control={control}
                rules={{ required: "Vui lòng nhập mật khẩu mới", minLength: { value: 8, message: "Tối thiểu 8 ký tự" } }}
                render={({ field }) => (
                    <TextField {...field} type="password" label="Mật khẩu mới" fullWidth margin="normal" error={!!errors.newPassword} helperText={errors.newPassword?.message} />
                )}
            />
            <Controller
                name="confirmPassword"
                control={control}
                rules={{ 
                    required: "Vui lòng xác nhận mật khẩu mới", 
                    validate: value => value === getValues("newPassword") || "Mật khẩu không trùng khớp." 
                }}
                render={({ field }) => (
                    <TextField {...field} type="password" label="Xác nhận mật khẩu mới" fullWidth margin="normal" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
                )}
            />

            <div className="submit_btn">
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
            </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalChangePassword;
