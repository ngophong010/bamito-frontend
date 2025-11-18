"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { registerUser } from "@/lib/redux/features/auth/authSlice"; // Import the new thunk
import { RegisterData, Role } from "@/types";
import Loading from "@/components/Loading/Loading";
import "./page.scss";

// Define the shape of the form data, including the confirmPassword field
type RegisterFormInputs = RegisterData & {
    confirmPassword?: string;
};

// Assume you fetch this from the API or have it in a constants file
const USER_ROLE_ID = 3; // The primary key ID for the 'USER' role

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get the loading status from the new authSlice
  const registrationStatus = useAppSelector((state) => state.auth.registration.status);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    dispatch(registerUser({
      userName: data.userName,
      email: data.email,
      password: data.password,
      // roleId is optional - backend assigns USER role by default
    }));
  };

  return (
    // Use the global loading state from the Redux slice
    <Loading loading={registrationStatus === 'loading'}>
      <div className="register-container">
        <div className="register-content">
          <div className="register-content-left">
            <div className="register-form-container">
              <h1>Đăng ký tài khoản</h1>
              <p>Tạo tài khoản mới để bắt đầu mua sắm</p>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="userName">Tên người dùng</label>
                  <input
                    type="text"
                    id="userName"
                    {...register("userName", {
                      required: "Tên người dùng là bắt buộc",
                      minLength: {
                        value: 3,
                        message: "Tên người dùng phải có ít nhất 3 ký tự"
                      }
                    })}
                    placeholder="Nhập tên người dùng"
                    className={errors.userName ? 'error' : ''}
                  />
                  {errors.userName && <span className="error-message">{errors.userName.message}</span>}
                </div>

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
                  <input
                    type="password"
                    id="password"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
                        message: "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt"
                      }
                    })}
                    placeholder="Ví dụ: Password123!"
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password.message}</span>}
                  <small className="password-hint">8+ ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&#)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu",
                      validate: value =>
                        value === getValues("password") || "Mật khẩu không trùng khớp"
                    })}
                    placeholder="Nhập lại mật khẩu"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                </div>

                <div className="wrapper-button-register">
                  <button type="submit" className="button-register" disabled={registrationStatus === 'loading'}>
                    {registrationStatus === 'loading' ? 'Đang xử lý...' : 'Đăng ký'}
                  </button>
                </div>
              </form>
              
              <div className="register-footer">
                <p>
                  Đã có tài khoản?{" "} 
                  <Link href="/login" className="login-link">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="register-content-right">
            <div className="register-banner">
              <h2>Chào mừng đến với BMT Shop</h2>
              <p>Khám phá những sản phẩm cầu lông chất lượng cao</p>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default Register;
