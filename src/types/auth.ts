import { UserProfile } from './user';
import { AuthTokensDTO } from './dtos/_base.dto';

// Data required for the login endpoint
export interface AuthCredentials {
  email: string;
  password: string;
}

// Defines the shape of the data returned from a successful login API call
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
  otpRequired: boolean;
  token?: AuthTokensDTO;
}

// Data required for the registration endpoint
export interface RegisterData extends AuthCredentials {
    userName: string;
    phoneNumber?: string;
}

export interface RegisterResponse {
  message: string;
  // It might also return the user object, but for this flow, a message is enough.
}

export interface ResetPasswordData {
    token: string;
    otpCode: string;
    newPassword: string;
}



export interface ResendOtpResponse {
  message: string;
  cooldownSeconds?: number; // used to prevent spam requests
}
