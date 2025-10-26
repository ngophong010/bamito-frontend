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
  const { status } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // The onSubmit handler is now just one line!
  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    // The client should not send the role. The backend should handle this.
    // However, to match your previous logic, we'll add it here.
    // In a true production app, the backend would assign the role.
    const registrationData: RegisterData = {
        email: data.email,
        userName: data.userName,
        password: data.password,
        roleId: USER_ROLE_ID, // Use the correct numeric ID
    };

    // Dispatch the single async thunk. It handles API calls, toasts, and navigation.
    dispatch(registerUser({ data: registrationData, router }));
  };

  return (
    // Use the global loading state from the Redux slice
    <Loading loading={status === 'loading'}>
      <div className="register-container">
        {/* --- Your JSX for the form remains the same --- */}
        <div className="register-content">
          <div className="register-content-left">
            <Link href="/" className="logo-wrapper">
                {/* ... logo ... */}
            </Link>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* ... (Your Input components are fine) ... */}
                {/* Use the 'register' with validation from react-hook-form */}
                {/* Example for confirmPassword: */}
                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: "Vui lòng xác nhận mật khẩu",
                        validate: value =>
                            value === getValues("password") || "Mật khẩu không trùng khớp."
                    })}
                />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

                <div className="wrapper-button-register">
                    <button type="submit" className="button-register" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </div>
            </form>
          </div>
          {/* ... */}
        </div>
      </div>
    </Loading>
  );
};

export default Register;
