import { UserProfile } from './user';

// Data required for the login endpoint
export interface AuthCredentials {
  email: string;
  password: string;
}

// Defines the shape of the data returned from a successful login API call
export interface LoginResponse {
  user: UserProfile;
  otpRequired: boolean;
}

// Data required for the registration endpoint
export interface RegisterData extends AuthCredentials {
    userName: string;
    roleId: number; // The primary key ID of the 'USER' role
}

export interface RegisterResponse {
  message: string;
  // It might also return the user object, but for this flow, a message is enough.
}
