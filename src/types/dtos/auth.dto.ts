/**
 * Auth-related DTOs for services and repositories.
 * Re-exports shared contracts from _base.dto and adds a composite AuthSessionDTO.
 */

import type { User } from "../user";

export type {
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
} from "./_base.dto";

// Composite session payload used by authService and authRepository
export interface AuthSessionDTO {
  user: User;
  tokens: import("./_base.dto").AuthTokensDTO;
}
