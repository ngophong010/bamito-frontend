import { Role } from './role';

// The full User object, as returned by the admin API
export interface User {
  id: number;
  userName: string;
  email: string;
  avatar: string | null;
  phoneNumber: string | null;
  birthday: string | null; // Dates are often strings in JSON
  status: number; // 0: inactive, 1: active
  role: Role;
}

// The shape of the user profile data (what a user sees of their own account)
export interface UserProfile extends Omit<User, 'roleId' | 'status'> {}

export interface ProfileResponse {
  user: UserProfile;
  favourites?: number[];
  orderCounts?: number;
}

// Profile update data
export interface UserProfileUpdateData {
  userName?: string;
  email?: string;
  phoneNumber?: string;
  birthday?: string;
  avatar?: string;
}

// Change password data
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Admin user creation data
export interface UserCreateData {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthday?: string;
  roleId: string; // 'R1', 'R2', 'R3'
  status?: number; // 0: inactive, 1: active (default: 1)
}

// Admin user update data
export interface UserUpdateData {
  userName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  birthday?: string;
  roleId?: string;
  status?: number;
}
