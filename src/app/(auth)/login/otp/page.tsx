"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';

import { authService } from '@/services/authService'; // Assuming you create these services
import { setLoginSuccess } from '@/lib/redux/features/user/userSlice';
import { clearOtpState } from '@/lib/redux/features/auth/otpSlice';
import './page.scss';

const OtpPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);

    // Get the email/context from the otpSlice, if you set it.
    const verificationContext = useAppSelector(state => state.otp.verificationContext);

    // Countdown timer for the resend button
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Redirect if there's no verification context (user landed here directly)
    useEffect(() => {
        if (!verificationContext) {
            toast.error("Phiên đăng nhập không hợp lệ.");
            router.replace('/login');
        }
    }, [verificationContext, router]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (otp.length !== 6 || !verificationContext) return;

        setIsLoading(true);
        try {
            await authService.verifyOtp(verificationContext, otp);
            const profileData = await authService.getProfile();
            
            dispatch(setLoginSuccess({ profile: profileData.user, favourites: profileData.favourites }));
            dispatch(clearOtpState());
            toast.success("Xác thực thành công! Đang đăng nhập...");
            router.push('/');
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Mã OTP không hợp lệ hoặc đã hết hạn.";
            toast.error(errorMessage);
            setOtp('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || !verificationContext) return;

        try {
            await authService.resendOtp(verificationContext); // This API call should be rate-limited on the backend
            toast.success("Đã gửi lại mã OTP.");
            setResendCooldown(60); // Reset the cooldown timer
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Không thể gửi lại mã. Vui lòng thử lại sau.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="otp-page-container">
            <div className="otp-card">
                <h2>Xác thực hai bước</h2>
                <p>Một mã gồm 6 chữ số đã được gửi đến email của bạn: <strong>{verificationContext}</strong></p>
                
                <form onSubmit={handleSubmit}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => <input {...props} />}
                        containerStyle="otp-input-container"
                        inputStyle="otp-input"
                        shouldAutoFocus
                    />
                    <button type="submit" className="otp-submit-btn" disabled={isLoading || otp.length !== 6}>
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>

                <div className="otp-resend">
                    <p>Không nhận được mã?</p>
                    <button onClick={handleResend} disabled={resendCooldown > 0}>
                        {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : 'Gửi lại mã'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
