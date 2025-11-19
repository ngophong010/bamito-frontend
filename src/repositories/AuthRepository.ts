import { AxiosInstance } from 'axios';
import { IAuthRepository } from './interfaces/IAuthRepository';
import { handleAxiosError } from './errors/RepositoryError';
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
import {
  LoginResponse,
  RegisterResponse,
  UserProfile,
  ResendOtpResponse,
  ProfileResponse
} from '@/types';
import type { ServiceResponse } from '@/types/common';

export class AuthRepository implements IAuthRepository {
  constructor(private readonly apiClient: AxiosInstance) {}

  async login(credentials: LoginDTO): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async register(data: RegisterDTO): Promise<RegisterResponse> {
    try {
      const response = await this.apiClient.post<{ data: RegisterResponse }>('/auth/register', data);
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async logout(): Promise<ServiceResponse> {
    try {
      const response = await this.apiClient.post<ServiceResponse>('/auth/logout');
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async refreshToken(data: RefreshTokenDTO): Promise<AuthTokensDTO>;
  async refreshToken(): Promise<ServiceResponse>;
  async refreshToken(data?: RefreshTokenDTO): Promise<AuthTokensDTO | ServiceResponse> {
    try {
      if (data) {
        const response = await this.apiClient.post<{ data: AuthTokensDTO }>('/auth/refresh-token', data);
        return response.data.data;
      } else {
        const response = await this.apiClient.post<ServiceResponse>('/auth/refresh-token');
        return response.data;
      }
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async verifyOtp(data: VerifyEmailDTO): Promise<UserProfile>;
  async verifyOtp(email: string, otpCode: string): Promise<LoginResponse>;
  async verifyOtp(dataOrEmail: VerifyEmailDTO | string, otpCode?: string): Promise<UserProfile | LoginResponse> {
    try {
      if (typeof dataOrEmail === 'string' && otpCode) {
        const response = await this.apiClient.post<{ data: LoginResponse }>('/auth/verify-otp', {
          email: dataOrEmail,
          otpCode
        });
        return response.data.data;
      } else {
        const response = await this.apiClient.post<{ data: UserProfile }>('/auth/verify-otp', dataOrEmail);
        return response.data.data;
      }
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async resendOtp(data: ResendOtpDTO): Promise<ResendOtpResponse>;
  async resendOtp(email: string): Promise<{ message: string }>;
  async resendOtp(dataOrEmail: ResendOtpDTO | string): Promise<ResendOtpResponse | { message: string }> {
    try {
      if (typeof dataOrEmail === 'string') {
        const response = await this.apiClient.post<{ message: string }>('/auth/resend-otp', { email: dataOrEmail });
        return response.data;
      } else {
        const response = await this.apiClient.post<{ data: ResendOtpResponse }>('/auth/resend-otp', dataOrEmail);
        return response.data.data;
      }
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await this.apiClient.get<{ data: ProfileResponse }>('/profile');
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async forgotPassword(data: ForgotPasswordDTO): Promise<{ message: string }>;
  async forgotPassword(email: string): Promise<{ message: string }>;
  async forgotPassword(dataOrEmail: ForgotPasswordDTO | string): Promise<{ message: string }> {
    try {
      const payload = typeof dataOrEmail === 'string' ? { email: dataOrEmail } : dataOrEmail;
      const response = await this.apiClient.post<{ message: string }>('/auth/forgot-password', payload);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async resetPassword(data: ResetPasswordDTO): Promise<{ message: string }> {
    try {
      const response = await this.apiClient.post<{ message: string }>('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async changePassword(data: ChangePasswordDTO): Promise<ServiceResponse> {
    try {
      const response = await this.apiClient.put<ServiceResponse>('/auth/change-password', data);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async changeEmail(data: ChangeEmailDTO): Promise<ServiceResponse> {
    try {
      const response = await this.apiClient.put<ServiceResponse>('/auth/change-email', data);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async beginTwoFactor(data: BeginTwoFactorDTO): Promise<ServiceResponse> {
    try {
      const response = await this.apiClient.post<ServiceResponse>('/auth/2fa/begin', data);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async verifyTwoFactor(data: VerifyTwoFactorDTO): Promise<AuthTokensDTO> {
    try {
      const response = await this.apiClient.post<{ data: AuthTokensDTO }>('/auth/2fa/verify', data);
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async updateProfile(data: UpdateProfileDTO): Promise<UserProfile> {
    try {
      const response = await this.apiClient.put<{ data: UserProfile }>('/profile', data);
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
}
