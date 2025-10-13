import { LoginResponse, RegisterResponse, UserProfile, ResendOtpResponse, ProfileResponse } from "@/types";
import {
    LoginDTO,
    RegisterDTO,
    RefreshTokenDTO,
    AuthTokensDTO,
    VerifyEmailDTO,
    ForgotPasswordDTO,
    ResetPasswordDTO,
    ChangeEmailDTO,
    BeginTwoFactorDTO,
    VerifyTwoFactorDTO,
    UpdateProfileDTO,
    ChangePasswordDTO,
    ResendOtpDTO
} from '@/types/dtos/auth.dto';
import type { ServiceResponse } from "@/types/common";

export interface IAuthRepository {
    login(credentials: LoginDTO): Promise<LoginResponse>;

    /**
 * Performs a user registration API call.
 * @param data The user's registration details.
 * @returns A promise that resolves to an object containing a success message.
 */
    register(data: RegisterDTO): Promise<RegisterResponse>;

    logout(): Promise<ServiceResponse>;

    refreshToken(data: RefreshTokenDTO): Promise<AuthTokensDTO>;

    /**
 * Requests to resend a new OTP code to the user.
 * Maps to: POST /api/v1/auth/resend-otp
 * @param email - The user's email.
 */
    refreshToken(): Promise<ServiceResponse>;

    verifyOtp(data: VerifyEmailDTO): Promise<UserProfile>;

    /**
 * Requests to resend a new OTP code to the user.
 * Maps to: POST /api/v1/auth/resend-otp
 * @param email - The user's email.
 */
    resendOtp(data: ResendOtpDTO): Promise<ResendOtpResponse>;

    /**
 * Fetches the full profile for the currently authenticated user.
 * Maps to: GET /api/v1/profile
 */
    getProfile(): Promise<ProfileResponse>;

    /**
 * Initiates the password reset process by requesting an OTP for a given email.
 * Maps to: POST /api/v1/auth/forgot-password
 * @param email - The user's email address.
 */
    forgotPassword(data: ForgotPasswordDTO): Promise<{ message: string }>;

    resetPassword(data: ResetPasswordDTO): Promise<{ message: string }>;

    changeEmail(data: ChangeEmailDTO): Promise<ServiceResponse>;

    beginTwoFactor(data: BeginTwoFactorDTO): Promise<ServiceResponse>;

    verifyTwoFactor(data: VerifyTwoFactorDTO): Promise<AuthTokensDTO>;

    updateProfile(data: UpdateProfileDTO): Promise<UserProfile>;

    changePassword(data: ChangePasswordDTO): Promise<ServiceResponse>;
}
