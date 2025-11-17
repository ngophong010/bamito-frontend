"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { AuthCredentials } from "@/types";
import { loginUser } from "@/lib/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Loading from "@/components/Loading/Loading";
import "./page.scss";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get the loading status from the Redux store
  const loginStatus = useAppSelector((state) => state.user?.login?.status || 'idle');

  const { register, handleSubmit, formState: { errors } } = useForm<AuthCredentials>();

  const onSubmit: SubmitHandler<AuthCredentials> = (data) => {
    dispatch(loginUser({
      identifier: data.email,
      password: data.password,
    }));
  };

  return (
    // Use the global loading state from the Redux slice
    <Loading loading={loginStatus === 'loading'}>
      <div className="login-container">
        {/* --- Your JSX for the form remains largely the same --- */}
        {/* It's now a pure presentation component. */}
        <div className="login-content">
            <div className="login-content-left">
                <Image
                    src="/images/login-banner.jpg"
                    alt="Login Banner"
                    width={500}
                    height={600}
                    className="login-banner"
                />
            </div>
            <div className="login-content-right">
                <div className="login-form-container">
                    <h1>Đăng nhập</h1>
                    <p>Chào mừng bạn trở lại!</p>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email", {
                                    required: "Email là bắt buộc",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                placeholder="Nhập email của bạn"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    {...register("password", {
                                        required: "Mật khẩu là bắt buộc",
                                        minLength: {
                                            value: 6,
                                            message: "Mật khẩu phải có ít nhất 6 ký tự"
                                        }
                                    })}
                                    placeholder="Nhập mật khẩu"
                                    className={errors.password ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password.message}</span>}
                        </div>

                        <div className="form-options">
                            <Link href="/forgot-password" className="forgot-password">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <div className="login-auth-buttons">
                            <button type="submit" className="login-button" disabled={loginStatus === 'loading'}>
                                {loginStatus === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="login-footer">
                        <p>
                            Chưa có tài khoản?{" "} 
                            <Link href="/register" className="register-link">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Loading>
  );
};

export default Login;
