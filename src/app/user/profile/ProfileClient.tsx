"use client";
import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Image from 'next/image';

// 1. Import correct services, types, and hooks
import { profileService } from '@/services/profileService';
import { ProfileResponse, UserProfileUpdateData } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateAvatar } from '@/lib/redux/features/user/userSlice';
import ModalChangePassword from '@/components/ModalChangePassword/ModalChangePassword';

import { ChangePasswordData } from '@/types';
import "./page.scss";

interface ProfileClientProps {
    initialProfileData: ProfileResponse;
}

// Define the shape of our form data
type FormInputs = Omit<UserProfileUpdateData, 'birthday'> & {
    birthday: dayjs.Dayjs | null;
    avatarFile?: FileList;
};

const ProfileClient = ({ initialProfileData }: ProfileClientProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        register,
        formState: { errors, isDirty }, // Use isDirty to know if the form has changed
    } = useForm<FormInputs>({
        defaultValues: {
            userName: initialProfileData.user.userName || '',
            email: initialProfileData.user.email || '',
            phoneNumber: initialProfileData.user.phoneNumber || '',
            birthday: initialProfileData.user.birthday ? dayjs(initialProfileData.user.birthday) : null,
        }
    });

    const avatarFile = watch('avatarFile');
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(initialProfileData.user.avatar);

    // Handle avatar preview with cleanup
    useEffect(() => {
        if (avatarFile && avatarFile.length > 0) {
            const file = avatarFile[0];
            const objectUrl = URL.createObjectURL(file);
            setPreviewAvatar(objectUrl);
            
            // Cleanup function to revoke object URL
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (previewAvatar && previewAvatar.startsWith('blob:')) {
                URL.revokeObjectURL(previewAvatar);
            }
        };
    }, []);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            // Validate required fields
            if (!data.userName || !data.userName.trim()) {
                toast.error("Vui lòng nhập họ và tên");
                return;
            }

            const updateData: UserProfileUpdateData = {
                userName: data.userName.trim(),
                email: data.email,
                phoneNumber: data.phoneNumber?.trim() || '',
                birthday: data.birthday ? data.birthday.format('YYYY-MM-DD') : undefined,
            };

            // Handle avatar file separately if present
            let avatarFile: File | undefined;
            if (data.avatarFile && data.avatarFile.length > 0) {
                avatarFile = data.avatarFile[0];
                
                // Additional client-side validation
                if (avatarFile.size > 5 * 1024 * 1024) {
                    toast.error("Kích thước ảnh phải nhỏ hơn 5MB");
                    return;
                }
            }

            const updatedProfile = await profileService.updateProfile(updateData, avatarFile);

            // Update the global avatar in the Redux store if it changed
            if (updatedProfile.avatar) {
                dispatch(updateAvatar(updatedProfile.avatar));
            }

            toast.success("Cập nhật hồ sơ thành công!");
            
            // Clean up preview URL to prevent memory leaks
            if (avatarFile && previewAvatar && previewAvatar.startsWith('blob:')) {
                URL.revokeObjectURL(previewAvatar);
            }
            
            router.refresh();
        } catch (error: any) {
            console.error('Profile update error:', error);
            
            // Handle specific error types
            if (error.response?.status === 413) {
                toast.error("Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.");
            } else if (error.response?.status === 400) {
                toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại.");
            } else if (error.response?.status === 409) {
                toast.error("Email hoặc số điện thoại đã được sử dụng.");
            } else {
                toast.error(error.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // The parent component defines WHAT happens on submit
    const handleChangePassword = async (data: ChangePasswordData) => {
        try {
            // The service call is now clean and doesn't need a userId
            await profileService.changePassword(data);
            toast.success("Thay đổi mật khẩu thành công!");
            setIsPasswordModalOpen(false); // Close the modal on success
        } catch (error: any) {
            toast.error(error.message || "Thay đổi mật khẩu thất bại.");
            // Re-throw the error to let the form know the submission failed
            throw error;
        }
    };

    return (
        <div className="user-page">
            <div className="user-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="username">
                        <div className="img-round">
                            <Image 
                                src={previewAvatar || '/images/default-avatar.png'} 
                                width={200} 
                                height={200} 
                                alt="avatar" 
                                className="avatar-image"
                            />
                            <label htmlFor="avatar-upload" className="upload-icon-label">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 5L17 7V9C17 10.1 16.1 11 15 11V13C16.1 13 17 13.9 17 15V17L19 19L21 17V15C21 13.9 20.1 13 19 13V11C20.1 11 21 10.1 21 9ZM7 9V7L5 5L3 7V9C3 10.1 3.9 11 5 11V13C3.9 13 3 13.9 3 15V17L5 19L7 17V15C7 13.9 6.1 13 5 13V11C6.1 11 7 10.1 7 9ZM12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="white"/>
                                </svg>
                                <span>Thay đổi ảnh</span>
                            </label>
                            <input 
                                type="file" 
                                id="avatar-upload" 
                                accept="image/jpeg,image/png,image/webp" 
                                {...register("avatarFile", {
                                    validate: {
                                        fileSize: (files) => {
                                            if (!files || files.length === 0) return true;
                                            return files[0].size <= 5 * 1024 * 1024 || "Kích thước ảnh phải nhỏ hơn 5MB";
                                        },
                                        fileType: (files) => {
                                            if (!files || files.length === 0) return true;
                                            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
                                            return allowedTypes.includes(files[0].type) || "Chỉ chấp nhận file JPG, PNG, WEBP";
                                        }
                                    }
                                })} 
                            />
                            {errors.avatarFile && <p className="user-info-error">{errors.avatarFile.message}</p>}
                        </div>
                        <h1>{initialProfileData.user.userName || 'Người dùng'}</h1>
                        <p className="user-role">{initialProfileData.user.role.roleName}</p>
                    </div>

                    <div className="btn-pageuser">
                        <button 
                            type="button" 
                            className="btn-change btn-secondary" 
                            onClick={() => setIsPasswordModalOpen(true)}
                            disabled={isLoading}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.1 16 12.7V16.7C16 17.4 15.4 18 14.8 18H9.2C8.6 18 8 17.4 8 16.8V12.8C8 12.2 8.6 11.6 9.2 11.6V10C9.2 8.6 10.6 7 12 7ZM12 8.2C11.2 8.2 10.5 8.9 10.5 9.7V11.4H13.6V9.7C13.6 8.9 12.9 8.2 12 8.2Z" fill="currentColor"/>
                            </svg>
                            Đổi mật khẩu
                        </button>
                        
                        <div className="btn-group">
                            <button 
                                type="button" 
                                className="btn-change btn-outline" 
                                onClick={() => {
                                    if (window.confirm('Đặt lại tất cả thay đổi?')) {
                                        router.refresh();
                                    }
                                }}
                                disabled={!isDirty || isLoading}
                            >
                                Hủy bỏ
                            </button>
                            
                            <button 
                                type="submit" 
                                className="btn-change btn-primary" 
                                disabled={!isDirty || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                        </svg>
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="user-info-container">
                        <Controller 
                            name="userName" 
                            control={control} 
                            rules={{ 
                                required: "Vui lòng nhập tên",
                                minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
                                maxLength: { value: 50, message: "Tên không được quá 50 ký tự" }
                            }} 
                            render={({ field }) => (
                                <div className="user-info-element">
                                    <label>Họ và tên *</label>
                                    <input {...field} className="user-info-input" placeholder="Nhập họ và tên" />
                                    {errors.userName && <p className="user-info-error">{errors.userName.message}</p>}
                                </div>
                            )} 
                        />

                        <Controller 
                            name="email" 
                            control={control} 
                            rules={{ 
                                required: "Email là bắt buộc",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email không hợp lệ"
                                }
                            }} 
                            render={({ field }) => (
                                <div className="user-info-element">
                                    <label>Email *</label>
                                    <input {...field} className="user-info-input" type="email" readOnly placeholder="Email" />
                                    <small className="user-info-note">Email không thể thay đổi</small>
                                    {errors.email && <p className="user-info-error">{errors.email.message}</p>}
                                </div>
                            )} 
                        />

                        <Controller 
                            name="phoneNumber" 
                            control={control} 
                            rules={{ 
                                pattern: {
                                    value: /^[0-9]{10,11}$/,
                                    message: "Số điện thoại phải có 10-11 chữ số"
                                }
                            }} 
                            render={({ field }) => (
                                <div className="user-info-element">
                                    <label>Số điện thoại</label>
                                    <input {...field} className="user-info-input" type="tel" placeholder="Nhập số điện thoại" />
                                    {errors.phoneNumber && <p className="user-info-error">{errors.phoneNumber.message}</p>}
                                </div>
                            )} 
                        />

                        <div className="user-info-element">
                            <label>Ngày sinh</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="birthday"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            format="DD/MM/YYYY"
                                            maxDate={dayjs().subtract(13, 'year')}
                                            minDate={dayjs().subtract(100, 'year')}
                                            slotProps={{
                                                textField: {
                                                    placeholder: "Chọn ngày sinh",
                                                    className: "user-info-input",
                                                    error: !!errors.birthday,
                                                    helperText: errors.birthday?.message
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                </form>
            </div>
            
            <ModalChangePassword
                open={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handleChangePassword}
            />
        </div>
    );
};

export default ProfileClient;
