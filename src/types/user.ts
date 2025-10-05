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
    favourites: number[];
}
