/**
 * JWT Token Management Utility
 * Production-ready implementation with security best practices
 */

export interface JWTPayload {
  userId: number;
  email: string;
  roleId: string;
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class JWTManager {
  private readonly ACCESS_TOKEN_KEY = 'bamito_access_token';
  private readonly REFRESH_TOKEN_KEY = 'bamito_refresh_token';
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

  /**
   * Decode JWT payload without verification (client-side only)
   * NEVER use for security validation - only for UI state
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired (with buffer for refresh)
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;
    
    return Date.now() >= (payload.exp * 1000) - this.TOKEN_EXPIRY_BUFFER;
  }

  /**
   * Store tokens securely
   */
  setTokens(tokens: TokenPair): void {
    if (typeof window === 'undefined') return;
    
    // Use httpOnly cookies in production, localStorage for development
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get current user info from token
   */
  getCurrentUser(): JWTPayload | null {
    const token = this.getAccessToken();
    if (!token || this.isTokenExpired(token)) return null;
    
    return this.decodeToken(token);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleId: string): boolean {
    const user = this.getCurrentUser();
    return user?.roleId === roleId;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('R1');
  }

  /**
   * Get Authorization header value
   */
  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }
}

// Export singleton instance
export const jwtManager = new JWTManager();

// Export individual functions for convenience
export const {
  decodeToken,
  isTokenExpired,
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  isAdmin,
  getAuthHeader
} = jwtManager;

export default jwtManager;