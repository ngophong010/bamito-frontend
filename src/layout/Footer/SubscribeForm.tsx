"use client";
import React, { useState } from 'react';
import { toast } from 'react-toastify';
// 1. Import the correct, refactored service function
import { subscriberService } from '@/services/subscriberService';

const SubscribeForm = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            toast.error("Vui lòng nhập một địa chỉ email hợp lệ.");
            return;
        }

        setIsLoading(true);
        try {
            await subscriberService.subscribeEmail(email);
            toast.success("Cảm ơn bạn đã đăng ký nhận tin!");
            setEmail("");
        } catch (error: any) {
            toast.error(error.message || "Email này đã được đăng ký hoặc đã xảy ra lỗi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </div>
        </form>
    );
};

export default SubscribeForm;
