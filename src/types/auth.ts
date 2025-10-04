// Data required for the login endpoint
export interface AuthCredentials {
  email: string;
  password: string;
}

// Data required for the registration endpoint
export interface RegisterData extends AuthCredentials {
    userName: string;
    roleId: number; // The primary key ID of the 'USER' role
}
