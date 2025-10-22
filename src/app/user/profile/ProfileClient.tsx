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
import { useAppDispatch } from '@/redux-toolkit/hooks';
import { updateAvatar } from '@/redux-toolkit/userSlice';
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
    const previewAvatar = avatarFile && avatarFile.length > 0 ? URL.createObjectURL(avatarFile[0]) : initialProfileData.user.avatar;

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsLoading(true);
        try {
            const updateData: UserProfileUpdateData = {
                userName: data.userName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                birthday: data.birthday ? data.birthday.toISOString() : undefined,
            };

            // Handle avatar file separately if present
            let avatarFile: File | undefined;
            if (data.avatarFile && data.avatarFile.length > 0) {
                avatarFile = data.avatarFile[0];
            }

            const updatedProfile = await profileService.updateProfile(updateData, avatarFile);

            // Update the global avatar in the Redux store if it changed
            if (updatedProfile.avatar) {
                dispatch(updateAvatar(updatedProfile.avatar));
            }

            toast.success("Cập nhật hồ sơ thành công!");
            router.refresh(); // Re-fetch server data to ensure everything is in sync
        } catch (error: any) {
            toast.error(error.message || "Cập nhật hồ sơ thất bại.");
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
                            <Image src={previewAvatar || '/images/default-avatar.png'} width={200} height={200} alt="avatar" />
                            <label htmlFor="avatar-upload" className="upload-icon-label">
                                {/* Upload Icon */}
                            </label>
                            <input type="file" id="avatar-upload" accept="image/*" {...register("avatarFile")} />
                        </div>
                        <h1>{initialProfileData.user.userName}</h1>
                    </div>

                    <div className="btn-pageuser">
                        <button type="button" className="btn-change" onClick={() => setIsPasswordModalOpen(true)}>
                            Đổi mật khẩu
                        </button>
                        <button type="submit" className="btn-change" disabled={!isDirty || isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>

                    <div className="user-info-container">
                        {/* Form fields using Controller */}
                        <Controller name="userName" control={control} rules={{ required: "Vui lòng nhập tên" }} render={({ field }) => (
                            <div className="user-info-element">
                                <label>Họ và tên</label>
                                <input {...field} className="user-info-input" />
                                {errors.userName && <p className="user-info-error">{errors.userName.message}</p>}
                            </div>
                        )} />
                        {/* ... other fields for email (readOnly), phoneNumber, birthday ... */}
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
