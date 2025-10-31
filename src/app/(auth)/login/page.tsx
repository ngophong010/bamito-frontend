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
            <div className="login-content-right">
                {/* ... */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* ... (your input fields with register("email", ...), etc.) */}
                    <div className="login-auth-buttons">
                        <button type="submit" className="login-button" disabled={loginStatus === 'loading'}>
                            {loginStatus === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                        {/* ... */}
                    </div>
                </form>
                {/* ... */}
            </div>
        </div>
      </div>
    </Loading>
  );
};

export default Login;
