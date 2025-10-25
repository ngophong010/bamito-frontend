"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendPasswordResetOtp } from "@/redux/authSlice"; // Import the new thunk
import Loading from "@/components/Loading/Loading";
import { regex } from "@/utils/regex";
import "./page.scss";

// Define the shape of our form data
interface FormInputs {
  email: string;
}

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get the loading status from the authSlice
  const { status } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  // The onSubmit handler is now just one clean line!
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // Dispatch the single async thunk. It handles everything else.
    dispatch(sendPasswordResetOtp({ email: data.email, router }));
  };

  return (
    // Use the global loading state from the Redux slice
    <Loading loading={status === 'loading'}>
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Quên mật khẩu</h1>
        <form className="forgot-password-content" onSubmit={handleSubmit(onSubmit)}>
          <div style={{ height: "10rem" }}>
            <div className="forgot-password-email">
              <FontAwesomeIcon
                className="forgot-password-email-icon"
                icon={faEnvelope}
              />
              <input
                className="forgot-password-email-input"
                placeholder="Email"
                {...register("email", {
                  required: "Vui lòng nhập email của bạn",
                  pattern: {
                    value: regex.EMAIL,
                    message: "Email không hợp lệ",
                  },
                })}
              />
            </div>
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            className="forgot-password-send"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Đang gửi...' : 'Gửi mã OTP'}
          </button>
        </form>
      </div>
    </Loading>
  );
};

export default ForgotPassword;
