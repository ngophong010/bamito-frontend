"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// 1. Import the correct, refactored service function and types
import { authService } from '@/services/authService';
import { ResetPasswordData } from '@/types';
import Loading from '@/components/Loading/Loading';
import './page.scss';

// Define the shape of our form, which is slightly different from the API data
type FormInputs = Omit<ResetPasswordData, 'token'>;

const ChangePasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 2. Read the SECURE TOKEN from the URL query parameter
    const token = searchParams.get('token');

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 3. Redirect if the token is missing
    useEffect(() => {
        if (!token) {
            toast.error("Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
            router.replace('/forgot-password');
        }
    }, [token, router]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!token) return; // Should not happen due to the useEffect check

        setIsLoading(true);
        try {
            // 4. The service call now includes the secure token
            await authService.resetPassword({
                token,
                otpCode: data.otpCode,
                newPassword: data.newPassword,
            });
            toast.success("Mật khẩu của bạn đã được thay đổi thành công!");
            router.push('/login'); // Redirect to login on success
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render the form if the token is missing to prevent user confusion
    if (!token) {
        return <Loading loading={true} />;
    }

    return (
        <Loading loading={isLoading}>
            <div className="change-password-container">
                <h1 className="change-password-title">Tạo Mật khẩu Mới</h1>
                <form className="change-password-content" onSubmit={handleSubmit(onSubmit)}>
                    {/* The email field is no longer needed on this page */}
                    
                    <div className="change-password-wrap-password">
                        <label>Mã OTP</label>
                        <div className="change-password-password">
                            <input {...register("otpCode", { required: "Vui lòng nhập mã OTP" })} placeholder="Mã OTP gồm 6 chữ số" />
                        </div>
                        {errors.otpCode && <p className="error">{errors.otpCode.message}</p>}
                    </div>
                    
                    <div className="change-password-wrap-password">
                        <label>Mật khẩu mới</label>
                        <div className="change-password-password">
                            <input type={showPassword ? "text" : "password"} {...register("newPassword", { required: "Vui lòng nhập mật khẩu mới", minLength: { value: 8, message: "Tối thiểu 8 ký tự" } })} placeholder="Mật khẩu mới" />
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)} />
                        </div>
                        {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}
                    </div>
                    
                    <button type="submit" className="change-password-send" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
            </div>
        </Loading>
    );
};

export default ChangePasswordForm;
