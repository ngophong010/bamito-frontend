import apiClient from './apiClient';
import { AuthRepository } from '@/repositories/AuthRepository';
import { handleApiError } from '@/lib/utils/errorHandler';
import { logger } from '@/lib/utils/logger';
import {
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  ChangePasswordDTO
} from '@/types/dtos/auth.dto';
import { LoginResponse, RegisterResponse, UserProfile } from '@/types';
import type { ServiceResponse } from '@/types/common';

export interface ProfileResponse {
  user: UserProfile;
  favourites?: number[];
}

interface IAuthService {
  login(credentials: LoginDTO): Promise<LoginResponse>;
  register(data: RegisterDTO): Promise<RegisterResponse>;
  logout(): Promise<ServiceResponse>;
  verifyOtp(email: string, otpCode: string): Promise<LoginResponse>;
  resendOtp(email: string): Promise<{ message: string }>;
  refreshToken(): Promise<ServiceResponse>;
  getProfile(): Promise<ProfileResponse>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(data: ResetPasswordDTO): Promise<{ message: string }>;
  changePassword(data: ChangePasswordDTO): Promise<ServiceResponse>;
}

/**
 * Service class for authentication and user management
 * Implements the Repository pattern with proper error handling
 */
class AuthService implements IAuthService {
  private readonly repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository(apiClient);
    logger.info('AuthService initialized');
  }

  /**
   * Authenticate user with credentials
   * @param credentials User login credentials
   * @returns Promise with login response including tokens
   */
  public async login(credentials: LoginDTO): Promise<LoginResponse> {
    try {
      logger.debug(`Login attempt for: ${credentials.identifier}`);
      const loginData = await this.repository.login(credentials);
      
      // Tokens are stored in HTTP-Only cookies automatically
      // No need to manually store tokens in localStorage
      
      return loginData;
    } catch (error) {
      logger.error(`Login failed for: ${credentials.identifier}`, error as Error);
      throw handleApiError(error, 'Login failed');
    }
  }

  /**
   * Register new user account
   * @param data User registration data
   * @returns Promise with registration response
   */
  public async register(data: RegisterDTO): Promise<RegisterResponse> {
    try {
      logger.info(`Registration attempt for: ${data.email}`);
      return await this.repository.register(data);
    } catch (error) {
      logger.error(`Registration failed for: ${data.email}`, error as Error);
      throw handleApiError(error, 'Registration failed');
    }
  }

  /**
   * Logout current user and clear tokens
   * @returns Promise with service response
   */
  public async logout(): Promise<ServiceResponse> {
    try {
      await this.repository.logout();
      logger.info('User logged out successfully');
    } catch (error) {
      // Continue with logout even if API call fails
      logger.warn('Logout API call failed:', error as Error);
    }
    // Cookies are cleared by backend
    return { errCode: 0, message: 'Logged out successfully' };
  }

  /**
   * Verify OTP code for two-factor authentication
   * @param email User's email address
   * @param otpCode OTP code to verify
   * @returns Promise with login response
   */
  public async verifyOtp(email: string, otpCode: string): Promise<LoginResponse> {
    try {
      logger.debug(`OTP verification for: ${email}`);
      const loginData = await this.repository.verifyOtp(email, otpCode);
      
      // Tokens are stored in HTTP-Only cookies automatically
      
      return loginData;
    } catch (error) {
      logger.error(`OTP verification failed for: ${email}`, error as Error);
      throw handleApiError(error, 'OTP verification failed');
    }
  }

  /**
   * Resend OTP code to user
   * @param email User's email address
   * @returns Promise with success message
   */
  public async resendOtp(email: string): Promise<{ message: string }> {
    try {
      logger.info(`Resending OTP to: ${email}`);
      return await this.repository.resendOtp(email);
    } catch (error) {
      logger.error(`Failed to resend OTP to: ${email}`, error as Error);
      throw handleApiError(error, 'Failed to resend OTP');
    }
  }

  /**
   * Refresh authentication tokens
   * @returns Promise with service response
   */
  public async refreshToken(): Promise<ServiceResponse> {
    try {
      logger.debug('Refreshing authentication token');
      const result = await this.repository.refreshToken();
      return result as ServiceResponse;
    } catch (error) {
      logger.error('Token refresh failed', error as Error);
      throw handleApiError(error, 'Token refresh failed');
    }
  }

  /**
   * Get current user profile with favourites
   * @returns Promise with user profile data
   */
  public async getProfile(): Promise<ProfileResponse> {
    try {
      logger.debug('Fetching user profile');
      return await this.repository.getProfile();
    } catch (error) {
      logger.error('Failed to fetch user profile', error as Error);
      throw handleApiError(error, 'Failed to fetch profile');
    }
  }

  /**
   * Initiate password reset process
   * @param email User's email address
   * @returns Promise with success message
   */
  public async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      logger.info(`Password reset request for: ${email}`);
      return await this.repository.forgotPassword(email);
    } catch (error) {
      logger.error(`Password reset failed for: ${email}`, error as Error);
      throw handleApiError(error, 'Password reset request failed');
    }
  }

  /**
   * Complete password reset with token and new password
   * @param data Reset password data including token and new password
   * @returns Promise with success message
   */
  public async resetPassword(data: ResetPasswordDTO): Promise<{ message: string }> {
    try {
      logger.info('Processing password reset');
      return await this.repository.resetPassword(data);
    } catch (error) {
      logger.error('Password reset failed', error as Error);
      throw handleApiError(error, 'Password reset failed');
    }
  }

  /**
   * Change user password with current password verification
   * @param data Change password data
   * @returns Promise with service response
   */
  public async changePassword(data: ChangePasswordDTO): Promise<ServiceResponse> {
    try {
      logger.info('Processing password change');
      return await this.repository.changePassword(data);
    } catch (error) {
      logger.error('Password change failed', error as Error);
      throw handleApiError(error, 'Password change failed');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export types for use in components
export type { IAuthService };
